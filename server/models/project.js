var db = require('../lib/db');
var User = require('./user');
var Resource = require('./resource');

var Project = {};

// Returns an object that represents a single project
// Contains counts of each resource as well as likes
Project.getProject = function (whereClause, attrs) {
  attrs = attrs || {};
  var likesJoin = {
    'likes.project_id': 'p.id',
  };
  Object.assign(likesJoin, attrs.likesJoin);

  var query = db
    .select().distinct()
    .select('p.*')
    .select('users.first')
    .select('users.last')
    .select(db.select().count('*').from('lyrics AS l').whereRaw('l.project_id = p.id').as('lyricCount'))
    .select(db.select().count('*').from('notes AS n').whereRaw('n.project_id = p.id').as('noteCount'))
    .select(db.select().count('*').from('recordings AS r').whereRaw('r.project_id = p.id').as('recordingCount'))
    .select(db.select().count('*').from('stablature AS s').whereRaw('s.project_id = p.id').as('stabCount'))
    .count('likes.id AS likes')
    .from('projects AS p')
    .leftJoin('users', 'users.id', '=', 'p.owner_id')
    .leftJoin('likes', likesJoin)
    .where(whereClause)
    .groupBy('p.id', 'users.first', 'users.last');

  return query
  .then(function(result){
    return result;
  });
};

// finds a project by id
Project.findById = function(projectId, userId) {
  if (userId){
    return Project.getProject({ 'p.id': projectId }, { likesJoin: {'likes.user_id': userId} })
    .then(function(rows){
       var project = rows[0];

      if (!project) { throw 404; }
      //checks that user owns that project if project is private 
      if (project.private && project.owner_id !== userId) { throw 401; }
      //projects exists and belongs to the expected user
      return project;
    });
  }
  else{
    return Project.getProject({ 'p.id': projectId })
    .then(function(rows) {
      var project = rows[0];

      if (!project) { throw 404; }
      //checks if project is private
      if (project.private) { throw 401; }
      //projects exists and belongs to the expected user
      return project;
    });
  }
  
};

// returns all projects for a user 
Project.findByUser = function (userId) {
  return Project.getProject({ owner_id: userId });
};

Project.findByPublic = function (userId) {
  //if a user is logged in 
  //object will contained 'liked' field 

  if (userId){
    return Project.getProject({ 'private': 0 }, { likesJoin: {'likes.user_id': userId } });
  } else{
    return Project.getProject({ 'private': 0 });
  }
};

Project.isPrivate = function(projectId){
  return db('projects').where('id', '=', projectId)
  .then(function(rows){
    return rows[0].private;
  });
};

// creates a new project
Project.create = function (attrs, username) {
  return db('projects').insert(attrs).returning('id')
    .then(function(rows) {
      var newProject = {
        id: rows[0],
        owner_id: attrs.owner_id,
        created_at: attrs.created_at,
        updated_at: attrs.updated_at,
      };
      return newProject;
    });
};

//updated a project based on id
Project.update = function (projectId, attrs) {
  // Remove attributes that don't exist in the projects table
  delete attrs.likes;
  delete attrs.noteCount;
  delete attrs.stabCount;
  delete attrs.lyricCount;
  delete attrs.recordingCount;
  return db('projects').where('id', '=', projectId).update(attrs)
  .then(function(){
    return db('projects').select('*').where({id: projectId})
    .then(function(rows){
      return rows[0];
    });
  });
};

//changes created_at when a resource is updated 
Project.updateResource = function(projectId) {
  var updated = {
    updated_at: Math.round(Date.now()/1000)
  };
  return db('projects').where('id', '=', projectId).update(updated);
};

//deletes an entire project
Project.del = function(projectId){
  //deleting all associated resources & likes
  return Resource.deleteAll(projectId)
  .then(function(){
    return db('likes').where('project_id', '=', projectId).del();
  })
  .then(function(){
    //deleting project
    return db('projects').where('id', '=', projectId).del();  
  });
};

module.exports = Project;
