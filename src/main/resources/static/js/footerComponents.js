Vue.component('foo', {
  template: `
    <footer class="bg-white border-top container-fluid m-0">
      <div class="row">
        <div class="col-6 text-left">
          <p>Copyright © 2019 - Columbia - All rights reserved - <router-link to="/legal">Mentions légales</router-link></p>
        </div>
        <div class="col-6 text-right">
          <p>Crafted on the  <span data-toggle="tooltip" data-placement="top" title="THAT'S A MOON.">{{ phases[phase] }} </span></p>
        </div>
      </div> 
    </footer>`,

  data() {
    return {
      phases: [ '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕' ],
      phase: 0,
      timer: '',
    }
  },
  created: function() {
    this.timer = setInterval(this.updatePhase, 400);
  },
  methods: {
    updatePhase: function () {
      this.phase = (this.phase + 1) % this.phases.length;
    },
  },
});
