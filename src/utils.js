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
    mkdirp = require('mkdirp'),
    path = require('path'),
    mime = require('mime');

module.exports = {

	HTTPFormHandler : function() {
		return multer({
		  dest : this.tmpDir,
		  onFileUploadComplete : function(file) {
			file.localpath = file.path;
			file.name = file.originalname;
			file.type = file.mimetype;
		  }
		});
	},

	parse_path: function(relPath, root, next) {
        var relPathRegexp = /\.\./g,
            mode = null, // @todo permissions mask?
            localPath = path.resolve( (root + '/' + relPath).replace(relPathRegexp, '')),
            basePath = path.dirname(localPath);

        mkdirp(basePath, mode, function(err) {
            next(err, localPath);
        });
    },

	gzip_compress: function() {
		console.log("Hi");
	},

	get_filename_from_path: function(path) {
		return path.split('\\').pop().split('/').pop();
	},

	normalize: function() {
		var self = this,
            file = arguments[0],
            next = arguments[arguments.length-1];

		if (typeof file === 'string') {
			fs.stat(file, function(err, stats) {
			  if (err) next(err);
			  next(null, {
					size : stats.size,
					localpath : file,
					name : self.get_filename_from_path(file),
					type : mime.lookup(file),
					encoding : 'binary'
				  });
			});
		}
		if (typeof file === 'object') {
            next(null, {
                size : (file.size ? file.size : 0),
                localpath : (file.localpath ? file.localpath : ''),
                remotepath: (file.name ? file.name : ''),
                name : (file.name ? self.get_filename_from_path(file.name) : ''),
                type : (file.contentType ? file.contentType : ''),
                encoding : file.encoding || 'binary',
                container: (file.container ? file.container : '')
              });
        }
	}
}
