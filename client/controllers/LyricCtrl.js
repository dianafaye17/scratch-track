app.controller('LyricCtrl', ['$scope', '$state', 'Lyric', 'Project', 'Resource', 
  function($scope, $state, Lyric, Project, Resource) {

  var projectId = $state.params.id;

  $scope.sort = Resource.sort;

  $scope.newLyric = {
    name: '',
    text: '',
    project_id: projectId
  };

  $scope.selectedLyric;

  $scope.toggleEditable = function() {
    var textbox = document.getElementById('lyrictext');

    if (textbox.hasAttribute('readOnly')) {
      textbox.removeAttribute('readOnly');
      document.getElementById('edit-lyrics-btn').innerHTML="SAVE";
      $scope.toggleMode = "Save";
    }
    else {
      textbox.setAttribute('readOnly', 'readOnly');
      document.getElementById('edit-lyrics-btn').innerHTML="EDIT";
      $scope.toggleMode = "Edit";
    }
  };


  $scope.submit = function(){
     $scope.submitted = true;
  };

  
  $scope.sortBy = function(field){
    Resource.sortBy(field);
  };


  $scope.toggleElement = function(id) {
    div = document.getElementById(id);

    if(div.style.display == "none") {
      div.style.display = "block";
    }
    else {
      div.style.display = "none";
    }
  };
  

  $scope.closeAccordion = function(){
    Resource.closeAccordion();
  };
  

  $scope.formatDate = function(date) {
    return Resource.formatDate(date);
  };


  $scope.updateVal = function(newValue) {
    $scope.val = newValue;
  };


  $scope.update = function(newTitle, newValue) {
    $scope.newLyric = {
      name: newTitle,
      text: newValue,
      project_id: projectId
    };
  };


  $scope.clearValues = function() {
    $scope.newLyric = {
      name: '',
      text: '',
      project_id: projectId
    };
    $scope.hasBeenReset = true;
  };


  $scope.getAll = function(projectId){
    Project.getProjectLyrics(projectId)
    .then(function(projects) {
      $scope.lyrics = projects;
    })
  };
  

  $scope.getOne = function(id){
    Lyric.select(id);
  };


  $scope.add = function(newLyric){
    console.log('text:', newLyric.text);
    console.log(typeof newLyric.text);
    if (newLyric.text === '') {
      console.log('hitting')
      return;
    }

    Lyric.create(newLyric)
    .then(function() {
      $scope.clearValues();
      $scope.getAll(projectId);
      $scope.closeAccordion();
    });
  };


  $scope.edit = function(id, data){
    if($scope.toggleMode === "Edit") {
      Lyric.edit(id, data); 
    }
    else {
      console.log("Cannot post. You are not in edit mode.")
    }
  };


  $scope.delete = function(noteId) {
    Lyric.del(noteId)
    .then(function() {
      $scope.getAll(projectId);
    });
  };


  // Makes textareas expand as you type
  $("textarea").keyup(function(e) {
    while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
      $(this).height($(this).height()+1);
    };
  });

  // Initial Setup
  $scope.getAll(projectId);
  $scope.lyrics = [];
  $scope.toggleMode = "Edit";
  
}]);
