define([
    'core/js/adapt',
    'core/js/data',
  ], function(Adapt, datacore) {

    var ImagesCollection = Backbone.Collection.extend({
        model: Backbone.Model.extend({
            defaults: {
            }
        }),
        url: window.location.origin + window.location.pathname + 'course/en/assets.json', // Assuming a JSON file with the list of images
        parse: function(response) {
            return response;
        }
    });
    
    function onDataReady() {
        const config = datacore.some(model => model.get('_preloadImages')?._isEnabled === true);
        if (!config) return;
        loadImages();
    }
    
    var imageUrls = [];
    var imagesCollection = new ImagesCollection();
    imagesCollection.fetch({
        success: function(collection, reponse) {
            collection.each(function(model) {
                var imageFileName = Object.keys(model.toJSON());
                imageUrls.push(imageFileName);
            });
        }
    });
    
    function loadImages() {
        var images = imageUrls[0];
        var imgPath = window.location.origin + window.location.pathname + 'course/en/assets/'; 
        var imgArray = [];
        for (var i = 0; i < images.length; i++) {
            imgArray.push(imgPath+images[i]);
        }
        const $cache = $('<div>');
        $cache[0].style = 'position:absolute;z-index:-1000;opacity:0;';
        document.body.appendChild($cache[0]);
        let loaded = 0;
        const onloaded = event => {
            const image = event.currentTarget;
            image.removeEventListener('load', onloaded);
            image.removeEventListener('error', onloaded);
            $(image).remove();
            loaded++;
            if (loaded === imgArray.length) $cache.remove();
        };
        imgArray.forEach(src => {
            const image = new Image();
            image.className = 'image-preload';
            image.src = src;
            image.addEventListener('load', onloaded);
            image.addEventListener('error', onloaded);
            $cache.append(image);
            console.log(image);
        });
    }

    Adapt.once('adapt:start', function() {
        onDataReady();
    
        Adapt.on('remove', function() {
            loadImages();
        });
    });
    
  });
  