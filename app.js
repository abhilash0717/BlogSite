var express        = require("express");
var app            = express();
var mongoose       = require("mongoose");
var bodyParser     = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/practiceBlog", {useNewUrlParser:true, useUnifiedTopology:true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.set('useFindAndModify', false);



var blogSchema = new mongoose.Schema ({
	title: String,
	image: String,
	body : String,
	created : {type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//Routes

//root route
app.get("/", function(req,res){
res.redirect("/blogs");	
});

//Index route
app.get("/blogs", function(req,res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("landing", {blogs:blogs});	
		}
	});	
});

//New Route
app.get("/blogs/new", function(req, res){
	res.render("new");	
});

// Create route
app.post("/blogs", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}else {
			res.redirect("/blogs");
		}
	});
});

//Show route
app.get("/blogs/:id" , function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else {
			res.render("show", {blog:foundBlog});
		}
	});
});

// EDIT ROUTE 
app.get("/blogs/:id/edit", function(req,res){
	 Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("edit",{blog:foundBlog}); 
		}
	 });
 });
//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else {
			res.redirect("/blogs/" + req.params.id);
		}
	});

});

//DELETE ROUTE

app.delete("/blogs/:id", function(req,res){
	//Destroy blog 
	Blog.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else {
			res.redirect("/blogs");
		}
	});
	//redirect somewhere
});
app.listen(3000, function(){
	console.log("server started");
});
