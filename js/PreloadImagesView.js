import Adapt from 'core/js/adapt';

export default class PreloadImagesView extends Backbone.View {

  initialize() {
    this.listenTo(Adapt, { 
        'app:dataReady': this.onPageViewRender,
    });
  }

  onPageViewRender(view) {
    // if (!view.model.get('_preloadImages')) return;
    // const backgroundSwitcherBlockView = new BackgroundSwitcherBlockView({ model: view.model, blockView: view });
    // this.$el.append(backgroundSwitcherBlockView.$el);
    const saData = view.model.get('_preloadImages');
    if (!saData || !saData._isEnabled) return;

    const model = new Backbone.Model({
      ...saData,
      _url: window.location.origin + window.location.pathname,
      _articleView: view,
      _componentViews: []
    });
    console.log(model._url);
    new PreloadImagesView({ model });
  }

}
