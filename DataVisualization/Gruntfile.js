module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.initConfig({
		concat: {
			dev : {
				src: ['public/javascripts/*.js'],
				dest:'public/application.js'
			}
		}
	});

	grunt.registerTask('dev',['concat:dev']);
}
