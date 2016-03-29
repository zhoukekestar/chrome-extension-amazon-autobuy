module.exports = function(grunt){



    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
               banner: '/*!\n' +
                        ' * amazon-autobuy v<%= pkg.version %>\n' +
                        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                        ' * Licensed under <%= pkg.license %>\n' +
                        ' * Update on <%= grunt.template.today("yyyy-mm-dd hh:MM;ss") %> \n' +
                        ' */\n',
                footer: "\n/*! @zkk */"
            },
            release: {
                files: {
                    "./AutoBuy/alertMsg.js": "./alertMsg.js",
                    "./AutoBuy/background.js": "./background.js",
                    "./AutoBuy/options.js": "./options.js",
                    "./AutoBuy/main.js": "./main.js",
                    "./AutoBuy/jquery.js": "./jquery.js",
                    "./AutoBuy/require.min.js": "./require.min.js"
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true, 
                        cwd: './', 
                        src: '*.{png,json,map,html,css}', 
                        dest: './AutoBuy'
                    }
                ]
            }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 默认任务
    grunt.registerTask('default', ['copy', 'uglify']);
};