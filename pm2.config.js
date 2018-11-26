module.exports = {
  apps: [
    {
      name: "web-panel",
      script: "npm",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: "start",
      // instances: 1,
      autorestart: false,
      watch: false,
      // max_memory_restart: '1G',
      env_production: {
        NODE_ENV: "production",
        PORT: "1812"
      },
      cwd: "/root/www/web-panel/current",
      error_file: "/root/www/web-panel/logs/app.err.log",
      out_file: "../logs/app.out.log",
      exec_mode: "fork_mode"
    }
  ],

  deploy: {
    production: {
      user: "root",
      host: [
        {
          host: "188.166.177.127",
          port: "2234"
        }
      ],
      ssh_options: "StrictHostKeyChecking=no",
      ref: "origin/master",
      repo: "git@github.com:hungphongbk/web-panel.git",
      path: "/root/www/web-panel",
      "post-deploy":
        "npm install && " +
        "npm run build && " +
        "pm2 reload pm2.config.js --env production",
      env: {
        NODE_ENV: "production",
        HOST: "web-panel.vaithuhay.com"
      }
    },
    "production-reload": {
      user: "root",
      host: [
        {
          host: "188.166.177.127",
          port: "2234"
        }
      ],
      ref: "origin/master",
      repo: "git@github.com:hungphongbk/web-panel.git",
      path: "/root/www/web-panel",
      "post-deploy":
        "pm2 reload pm2.config.js --env production",
      env: {
        NODE_ENV: "production",
        HOST: "web-panel.vaithuhay.com"
      }
    }
  }
};
