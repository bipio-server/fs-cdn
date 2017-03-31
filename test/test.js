/**
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var fs = require('fs'),
	assert = require('assert'),
	should = require('should'),
	Fs_Cdn = require('../index.js'),
	remoteConfig = require('../config.json'),
	pkgcloud = require('pkgcloud'),
	async = require('async');

remoteConfig.region = 'ORD';
localConfig = {
	data_dir: __dirname + '/files/dest'
};

var fs_cdn_remote = new Fs_Cdn(remoteConfig),
	fs_cdn_local = new Fs_Cdn(localConfig),
	testFile = __dirname + '/files/src/testFile.txt';


describe('fs-cdn', function() {

	describe('fs', function() {

		describe('save', function() {
			it('should save src/testFile.txt as dest/tmp/testFile.txt', function(done) {
				fs_cdn_local.save('testFile.txt', testFile, function(err, file) {
					should.not.exist(err);
					should.exist(file);
					file.should.have.property('localpath');
					file.should.have.property('encoding');
					file.should.have.property('size');
					file.should.have.property('type');
					file.should.have.property('name');
					done();
				});
			});
		});

		describe('get', function() {
			it('should get src/testFile.txt from file system and return a readStream', function(done) {
				fs_cdn_local.get(testFile, function(err, file, stream) {
					should.not.exist(err);
					should.exist(file);
					should.exist(stream);
					file.should.have.property('localpath');
					file.should.have.property('encoding');
					file.should.have.property('size');
					file.should.have.property('type');
					file.should.have.property('name');
					stream.should.have.property('pipe');
					done();
				});
			});
		});

		describe('list', function() {
			it('should list all files in files/dest directory', function(done) {
				fs_cdn_local.list(localConfig.data_dir, function(err, result) {
					if (err) throw new Error(err);
					done();
				});
			});
		});

	});

	describe('cdn', function() {

		describe('save', function() {
			it('should save src/test.png as dest/tmp/test_save.png to cdn and mirror sync to dst/tmp/ in CDN', function(done) {
				fs_cdn_remote.save('testFile.txt', testFile, function(err, file) {
					should.not.exist(err);
					should.exist(file);
					file.should.have.property('localpath');
					file.should.have.property('encoding');
					file.should.have.property('container');
					file.should.have.property('size');
					file.should.have.property('type');
					file.should.have.property('name');
					done();
				});
			});
		});

		describe('get', function() {
			it('should get src/testFile.txt from file system and return a readStream with link to remote container', function(done) {
				fs_cdn_remote.get(testFile, function(err, file, stream) {
					should.not.exist(err);
					should.exist(file);
					should.exist(stream);
					file.should.have.property('localpath');
					file.should.have.property('encoding');
					file.should.have.property('container');
					file.should.have.property('size');
					file.should.have.property('type');
					file.should.have.property('name');
					stream.should.have.property('pipe');
					done();
				});
			});
		});

		/*describe('list', function() {
			it('should list all files in container', function(done) {
				fs_cdn_remote.list(function(err, result) {
					if (err) throw new Error(err);
					done();
				});
			});
		});*/

	});



	/*describe('remove', function() {

		it('should remove test files from CDN', function(done) {
			async.parallel({
				'testFile.txt' : function(callback) {
								fs_cdn_remote.remove('test.png', 'bipio-beta-test', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							},
				'test_save_stream.png' : function(callback) {
								fs_cdn_remote.remove('test_save_stream.png', 'bipio-beta-test', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							},
				'test_save_string.png' : function(callback) {
								fs_cdn_remote.remove('test_save_string.png', 'bipio-beta-test', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							}
			}, function(err, results) {
				if (err) throw new Error(err);
				done();
			});
		});

		it('should remove test files from file system', function(done) {
			async.parallel({
				'test_save_stream.png' : function(callback) {
								fs_cdn_local.remove(__dirname + '/files/dest/test_save_stream.png', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							},
				'test_save_string.png' : function(callback) {
								fs_cdn_local.remove(__dirname + '/files/dest/test_save_string.png', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							},
				'test_get_stream_remote.png' : function(callback) {
								fs_cdn_local.remove(__dirname + '/files/dest/test_get_stream_remote.png', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							},
				'test_get_string_remote.png' : function(callback) {
								fs_cdn_local.remove(__dirname + '/files/dest/test_get_string_remote.png', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							},
				'test_get_stream_local.png' : function(callback) {
								fs_cdn_local.remove(__dirname + '/files/dest/test_get_stream_local.png', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							},
				'test_get_string_local.png' : function(callback) {
								fs_cdn_local.remove(__dirname + '/files/dest/test_get_string_local.png', function(err, result) {
									if (err) {
										callback(err);
									}
									callback(null, result)
								})
							}
			}, function(err, results) {
				if (err) throw new Error(err);
				done();
			});
		});

	});*/

});
