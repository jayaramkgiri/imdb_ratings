(function(){
  var SEARCH_URI = "https://cors-anywhere.herokuapp.com/http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=";
  var MOVIE_URI = "https://cors-anywhere.herokuapp.com/http://app.imdb.com/title/maindetails?tconst=";
  $(init);
  function init() {
    $("#notification-bar").hide();
    $('#search-movie').click(searchMovie);
    var title = $('#movie-title');
    var tbody = $('#results tbody');

    function searchMovie(){
      var movieTitle = title.val();
      $("#notification-bar").hide();
      tbody.empty();
      if (movieTitle){
        $("#search-movie").attr("disabled", true);
      /*fetch movies from the search term*/
        $.ajax({
          url: SEARCH_URI + movieTitle,
          dataType: "json",
          success: fetchMovies,
          error: function() {
            $('#notification-bar').show();
            $("#search-movie").attr("disabled", false);
          }
        });
      } else {
        alert("Enter title");
      }
    }

    function fetchMovies(response) {
      if (!response || !response.title_exact) {
        alert("No movie found");
      } else {
        /*Render each movies and it's rating*/
        var movies = response.title_exact;
        for(var m in movies) {
          $.ajax({
            url: MOVIE_URI + movies[m].id,
            dataType: "json",
            success: renderMovies,
            error: function() {
              alert("fetching" + movies[m].id + failed);
            }
          });
        }
      }
      $("#search-movie").attr("disabled", false);
    }

    function renderMovies(movie) {
      if (movie && movie.data) {
        var data = movie.data;
        var tr = '<tr>';
        tr += createRow(data.title);
        tr += createRow(data.rating);
        tr += createRow(data.num_votes);
        tr += '</tr>';
        tbody.append(tr);
      }
    }

    function createRow(data) {
      var val = data || "NA";
      return '<td>' + val + '</td>';
    }
  }
})();
