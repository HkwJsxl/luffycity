<template>
  <div class="login">
    <div class="box">
      <i class="el-icon-close" @click="close_login"></i>
      <div class="content">
        <div class="nav">
          <span :class="{active: login_method === 'is_pwd'}"
                @click="change_login_method('is_pwd')">密码登录</span>
          <span :class="{active: login_method === 'is_sms'}"
                @click="change_login_method('is_sms')">短信登录</span>
        </div>

        <el-form v-if="login_method==='is_pwd'" :model="login_pwd_form" ref="login_pwd_form" :rules="login_pwd_rules">
          <el-form-item prop="username">
            <el-input
                placeholder="用户名/手机号/邮箱"
                prefix-icon="el-icon-user"
                v-model="login_pwd_form.username"
                clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                placeholder="密码"
                prefix-icon="el-icon-key"
                v-model="login_pwd_form.password"
                clearable
                show-password>
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="commit_login('login_pwd_form')">登录</el-button>
        </el-form>

        <el-form v-if="login_method==='is_sms'" :model="login_sms_form" ref="login_sms_form" :rules="login_sms_rules">
          <el-form-item prop="mobile">
            <el-input
                placeholder="手机号"
                prefix-icon="el-icon-phone-outline"
                v-model="login_sms_form.mobile"
                clearable
                @blur="check_mobile">
            </el-input>
          </el-form-item>
          <el-form-item prop="sms">
            <el-input
                placeholder="验证码"
                prefix-icon="el-icon-chat-line-round"
                v-model="login_sms_form.sms"
                clearable>
              <template slot="append">
                <span class="sms" @click="send_sms">{{ login_sms_form.sms_interval }}</span>
              </template>
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="commit_login_sms('login_sms_form')">登录</el-button>
        </el-form>

        <div class="foot">
          <span @click="go_register">立即注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      login_method: 'is_pwd',
      login_pwd_form: {
        username: '',
        password: '',
      },
      login_sms_form: {
        mobile: '',
        sms: '',
        sms_interval: '获取验证码',
        is_send: true,
      },
      login_pwd_rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      login_sms_rules: {
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {min: 11, max: 11, message: '长度不匹配', trigger: 'blur'},
        ],
        sms: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
        ]
      },
    }
  },
  methods: {
    close_login() {
      this.$emit('close')
    },
    go_register() {
      this.$emit('go')
    },
    change_login_method(method) {
      this.login_method = method;
    },
    check_mobile() {
      if (!this.login_sms_form.mobile) return;
      if (!this.login_sms_form.mobile.match(/^1[3-9][0-9]{9}$/)) {
        this.$message({
          message: '手机号格式错误.',
          type: 'warning',
          duration: 3000,
        });
        return false;
      }
      this.login_sms_form.is_send = true;
    },
    send_sms() {
      if (!this.login_sms_form.is_send) return;

      if (!this.login_sms_form.mobile) {
        this.$message({
          message: '手机号未填写.',
          type: 'warning',
          duration: 3000,
        });
        return;
      }

      this.login_sms_form.is_send = false;
      let sms_interval_time = 60;
      this.login_sms_form.sms_interval = "发送中...";

      this.$axios.post(this.$settings.base_url + '/user/sms/', {
        mobile: this.login_sms_form.mobile,
      }).then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.$message({
            message: '发送成功.',
            type: 'success',
            duration: 3000,
          });
        } else {
          this.$message({
            message: response.data.message,
            type: 'warning',
            duration: 3000,
          });
          // 发送失败不计时
          clearInterval(timer);
          this.login_sms_form.sms_interval = "获取验证码";
          this.login_sms_form.is_send = true;
        }
      }).catch(errors => {
        console.log(errors);
      })

      let timer = setInterval(() => {
        if (sms_interval_time <= 1) {
          clearInterval(timer);
          this.login_sms_form.sms_interval = "获取验证码";
          this.login_sms_form.is_send = true; // 重新回复点击发送功能的条件
        } else {
          sms_interval_time -= 1;
          this.login_sms_form.sms_interval = `${sms_interval_time}秒后再发`;
        }
      }, 1000);
    },
    commit_login(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message({
            message: '验证失败.',
            type: 'warning',
            duration: 3000,
          });
          return false;
        }
        this.$axios.post(
            this.$settings.base_url + '/user/login/', {
              username: this.login_pwd_form.username,
              password: this.login_pwd_form.password,
            }
        ).then(response => {
          console.log(response.data);
          if (response.data.code === 0) {
            this.$message({
              message: '登录成功.',
              type: 'success',
              duration: 3000,
            });
            this.$cookies.set('token', response.data.data.token, '7d');
            this.$cookies.set('username', response.data.data.username, '7d');
            // 关闭登录窗口(子传父)
            this.$emit('close');
            // 给父组件，Header传递一个事件，让它从cookie中取出token和username
            this.$emit('login_success');
          } else {
            this.$message({
              message: '登录失败.',
              type: 'warning',
              duration: 3000,
            });
          }
        }).catch(errors => {
          console.log('报错---', errors);
        })
      });
    },
    commit_login_sms(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message({
            message: '验证失败.',
            type: 'warning',
            duration: 3000,
          });
          return false;
        }
        this.$axios.get(
            this.$settings.base_url + '/user/login/', {
              params: {
                mobile: this.login_sms_form.mobile,
                sms_code: this.login_sms_form.sms,
              }
            }
        ).then(response => {
          console.log(response.data);
          if (response.data.code === 0) {
            console.log('登录成功.');
            this.$cookies.set('token', response.data.data.token, '7d');
            this.$cookies.set('username', response.data.data.username, '7d');
            // 关闭登录窗口(子传父)
            this.$emit('close');
            // 给父组件，Header传递一个事件，让它从cookie中取出token和username
            this.$emit('login_success');
          } else {
            console.log('登录失败.')
          }
        }).catch(errors => {
          console.log('报错---', errors);
        })
      });
    }
  }
}
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
}

.box {
  width: 400px;
  height: 420px;
  background-color: white;
  border-radius: 10px;
  position: relative;
  top: calc(50vh - 210px);
  left: calc(50vw - 200px);
}

.el-icon-close {
  position: absolute;
  font-weight: bold;
  font-size: 20px;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.el-icon-close:hover {
  color: darkred;
}

.content {
  position: absolute;
  top: 40px;
  width: 280px;
  left: 60px;
}

.nav {
  font-size: 20px;
  height: 38px;
  /*border-bottom: 2px solid darkgrey;*/
}

.nav > span {
  margin: 0 20px 0 35px;
  color: darkgrey;
  user-select: none;
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 2px solid darkgrey;
}

.nav > span.active {
  color: black;
  border-bottom: 3px solid black;
  padding-bottom: 9px;
}

.el-input, .el-button {
  margin-top: 40px;
}

.el-button {
  width: 100%;
  font-size: 18px;
}

.foot > span {
  float: right;
  margin-top: 20px;
  color: orange;
  cursor: pointer;
}

.sms {
  color: orange;
  cursor: pointer;
  display: inline-block;
  width: 70px;
  text-align: center;
  user-select: none;
}
</style>
