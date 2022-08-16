//Florida:
//https://geodata.dep.state.fl.us/datasets/florida-public-beach-access-sites/api

//California:
//https://api.coastal.ca.gov/access/v1/locations

window.onload = function(){
    console.log("Waves!!!")
    california();
    filters();
    whichstate();

}
/*
function filters(){
  console.log("filters")

          $("#filters").append(`
                          <div class="form-group col-12 col-lg-4 text-white ">
                            <label for="topicSelect"><h3>Select a State</h3></label>
                            <div class="border-bottom mb-0 mb-lg-3">
                                <select onchange="whichstate()" class="form-control border-0" id="stateSelect">
                                <option value=california>California</option>
                                <option value=florida>Florida</option>
                                </select>
                            </div>
                        </div>`)
          console.log($("stateSelect").value)

}


function whichstate(){
  console.log("515345" + $(".florida-btn").attr("value"))

  console.log("fdfaf" + document.getElementById("stateSelect").attr("value"))
  //document.getElementById("stateSelect").value = 
  if (document.getElementById("stateSelect").value == "california"){
    california();
  } else if (document.getElementById("stateSelect").value == "florida"){
    florida()
  }
}
*/

function florida(){
  $("#beach-listings").empty()


  $.ajax({
      type: 'GET',
      url: `https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/AQUATIC_PRESERVES/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json`,
      dataType: 'json',
      beforeSend:  function(){
          $(".loader").show()
      },
      complete: function(){
          $(".loader").hide()
      },
      success: function(result){
          let count = 0;
          let image = "images/sample-beach1a.jpg"
          console.log(result.features[0].attributes.BEACH_OR_CITY_NAME)
          console.log(result.features[0].attributes)
          for(let i = 0; i < 50; i++){
              count++;
              $("#beach-listings").append(`

              <div class="col-12 col-sm-4 col-lg-3 beach-item">
                <div class="card border-0">
                  <img class="card-img-top beach-img " src=${image}>
                      <div class="card-info">
                          <h3 class="card-title">${result.features[i].attributes.BEACH_OR_CITY_NAME}</h3>
                          <p class="text-royal pl-3 pt-2">${result.features[i].attributes.LOCATION_ADDRESS}</p>
                      </div>

                </div>
              </div>`)


                    

          }
          $("#count").text(`${count} beaches`)
          beachPagination(count)


      }

  });


}





function california(){
  $("#beach-listings").empty()
  console.log("TEST 1")



  $.ajax({
      type: 'GET',
      url: `https://api.coastal.ca.gov/access/v1/locations`,
      dataType: 'json',
      beforeSend:  function(){
          $(".loader").show()
      },
      complete: function(){
          $(".loader").hide()
      },
      success: function(result){

          console.log("TEST 2")


          let count = 0;
          let image;

          for(let i = 0; i < 130; i++){
            image = "images/sample-beach1a.jpg";

            if (result[i].Photo_1){
              image = result[i].Photo_1;

            }

            if (result[i].FISHING == "Yes"){

                  count++;
                  $("#beach-listings").append(`
                  <div class="col-12 col-sm-4 col-lg-3 beach-item">

            <div class="card border-0">
                <img class="card-img-top beach-img " src=${image}>
                <div class="card-info">
                    <h3 class="card-title">${result[i].NameMobileWeb}</h3>
                      <p class="text-royal pl-3 pt-2">${result[i].LocationMobileWeb}</p>
                </div>

              </div>
          </div>
                      `)

            }
        }
          $("#count").text(`${count} beaches`)
          beachPagination(count)

      }


  });

}


function getPageList(totalPages, page, maxLength){

  function range(start, end){

    return Array.from(Array(end - start + 1), (_, i) => i + start);
  }
  var sideWidth = maxLength < 9 ? 1 : 30;
  var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
  var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

  if(totalPages <= maxLength){
    return range(1, totalPages);
  }

  if(page <= maxLength - sideWidth - 1 - rightWidth){
    return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
  }

  if(page >= totalPages - sideWidth - 1 - rightWidth){
    return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
  }

  return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}

function beachPagination(count){

  var numberOfItems = count;
  var limitPerPage = 8; //How many card items visible per a page
  var totalPages = Math.ceil(numberOfItems / limitPerPage);
  var paginationSize = 7; //How many page elements visible in the pagination
  var currentPage;

  function showPage(whichPage){

    if(whichPage < 1 || whichPage > totalPages) return false;

    currentPage = whichPage;

    $("#beach-listings .card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

    $(".pagination li").slice(1, -1).remove();

    getPageList(totalPages, currentPage, numberOfItems).forEach(item => {
      $("<li>").addClass("page-item").addClass(item ? "current-page" : "dots")
      .toggleClass("active", item === currentPage).append($("<a>").addClass("page-link")
      .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page");
    });

    $(".previous-page").toggleClass("disable", currentPage === 1);
    $(".next-page").toggleClass("disable", currentPage === totalPages);
    return true;
  }

  $(".pagination").append(
    $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Prev")),
    $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-link").attr({href: "javascript:void(0)"}).text("Next"))
  );

  $("#beach-listings").show();
  showPage(1);

  $(document).on("click", ".pagination li.current-page:not(.active)", function(){
    return showPage(+$(this).text());
  });

  $(".next-page").on("click", function(){
    return showPage(currentPage + 1);
  });

  $(".previous-page").on("click", function(){
    return showPage(currentPage - 1);
  });
};






/*


// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
  }
  
  
  // Toggle between showing and hiding the sidebar when clicking the menu icon
  var mySidebar = document.getElementById("mySidebar");
  
  function w3_open() {
    if (mySidebar.style.display === 'block') {
      mySidebar.style.display = 'none';
    } else {
      mySidebar.style.display = 'block';
    }
  }
  
  // Close the sidebar with the close button
  function w3_close() {
      mySidebar.style.display = "none";
  }

  */