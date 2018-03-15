(function($) {
  $(document).ready(function() {
    var url = "http://www.inlamning.kirderf.se/wp_inlamning/index.php/wp-json/wp/v2/posts/?_embed=true&filter[orderby]=date&order=asc";
    $.ajax({
      type: "GET", //Hämta data från url via ajaxmetoden
      url: url,
      timeout: 2000,
      // loggar BEFORE innan hämtning
      beforeSend: function() {
        console.log('BEFORE');
      },
      // loggar COMPLETE efter hämtning
      complete: function() {
        console.log('COMPLETE');
      },
      // hämtar och loggar data
      success: function(wpData) {
        console.log(wpData);
        displayWP(wpData);
      },
      error: function() {
        console.log('ERROR');
      }
    })

    // funktion för att visa ut all data
    function displayWP(pData) {
      // loopa igenom alla arrayer
      for (var i = 0; i < pData.length; i++) {
        // om det finns embedded media
        if (pData[i]._embedded['wp:featuredmedia']) {
          // console.log('detta är pdata', pData);
          // lagra rubriken i variabel
          var wpTitle = pData[i].title.rendered;
          // lagra innehållet i variabel
          var wpContent = pData[i].content.rendered;
          // lagra bild i variabel
          var wpBild = pData[i]._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
          // lagrar array från featuredmedia i variabel
          var frag_json = pData[i]._embedded['wp:featuredmedia'][0];
          // hämtar bildrubrik även om vi inte har någon
          var wpCaption = frag_json.caption.rendered;
          // hämtar bildnamn
          var wpFeaturedmediaTitle = frag_json.title.rendered;
          // lagrar inläggets id i variabel
          var wpID = pData[i].id;
          // skapar en meny dynamiskt
          var navMenu = '';
          navMenu += '<a ';
          // skapar en länk till varje inlägg
          navMenu += 'href="#' + 'articleID_' + wpID + '">';
          navMenu += wpTitle + '</a>';
          // navMenu += '</li>';
          $('.navigation').append(navMenu);
          // visar bilden i en figure, också dynamiskt. Bygger HTML i variabel, += fyller på variabeln
          var wpHTML = '';
          wpHTML += '<figure>';
          wpHTML += '<img src="' + wpBild + '">';
          wpHTML += '<figcaption>' + wpCaption + '</figcaption>';
          wpHTML += '</figure>';
          wpHTML += '<section id="articleID_' + wpID + '">'
          wpHTML += '<h1>' + wpTitle + '</h1>';
          wpHTML += wpContent;
          wpHTML += '</section>';
          $('.content').append(wpHTML);

          // script för animering av menyn vid klick
          $('.navigation a').on('click', function(e) {
            e.preventDefault();
            // lägger till och tar bort class för att ändra färg beroende på vilken "flik" som är aktiv
            $('.navigation a').removeClass('active');
            $(this).addClass('active');
            // animerar bodyn när scriptet körs
            $('html, body').animate({
              scrollTop: $(this.hash).offset().top
            });
          });
          // lägger till hover effekt på menyns länkar
          $('.navigation a').hover(
            function() {
              // lägger till klassen 'hover' för att byta färg
              $(this).addClass('hover');
            },
            function() {
              // tar bort klassen 'hover' och återgår till originalfärgen
              $(this).removeClass('hover');
            }
          );
        }
      }
    }
  });
})(jQuery)