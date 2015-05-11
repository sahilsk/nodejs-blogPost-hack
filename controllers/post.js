var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
var User = require('../models/User');
var Post = require("../models/Post");
var secrets = require('../config/secrets');
var mongoose = require("mongoose");


/**
 * GET /posts
 * get all posts.
 */
exports.getPosts = function(req, res) {
  if (req.user) return res.redirect('/');

  var posts = Post.find(function(err, result){
  	if(err){
  		console.log("Failed to fetch result");
  	}
   	res.render('posts/index', {
    	posts:result
  	});

  });
};

/**
 * GET /posts/{id}
 * get single posts.
 */

 exports.getPost = function(req, res) {
  //if (req.user) return res.redirect('/');

  var posts = Post.findOne({_id: req.params.id }, function(err, result){
  	if(err){
  		console.log("Failed to fetch result");
  	}
  	console.log( result.threads);
   	res.render('posts/show', {
    	title: result.title,
    	content:  result.threadStr(),
    	threads: result.threads
  	});

  });
};




/**
 * GET /posts/new
 * New Post page.
 */
exports.getNewPost = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('posts/new', {
    title: 'New Post'
  });
};

/**
* POST /posts
* New post create
*/
exports.postNewPost = function(req, res) {
  //if (req.user) return res.redirect('/');


  var content = req.body.content;

  var post = new Post();
  post.title = req.body.title;
  post.uid = mongoose.Types.ObjectId("554fee3450ec08fa06159511");
  
  var paraArr = content.split("</p>");

  var threads = [];

  for(var i=0; i < paraArr.length; i++){
  	console.log( paraArr[i].length);
  	threads[i] = {
  		content: paraArr[i],
  		commentable: (paraArr[i].length > 30) ? true : false
  	};
  }

  post.threads = threads;
  post.save( function(err){
  	if(err){
  		console.log("error saving post", err);
  		throw new Error("Errors aving post". err);
  	}else{
  		console.log("post saved");
  		 req.flash("status", "post added");
  		 res.redirect("/posts");
  	}

  });

  //res.redirect('/posts');
};






