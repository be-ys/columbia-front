<script>
    export default {
        data() {
            return {
                phases: ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕'],
                phase: 0,
                timer: '',
            }
        },

        created: function () {
            this.timer = setInterval(this.updatePhase, 175);
        },

        methods: {
            updatePhase: function () {
                this.phase = (this.phase + 1) % this.phases.length;
            }
        }
    }
</script>

<template>
    <footer class="border-top container-fluid m-0">
        <div class="row">
            <div class="col-6 text-left">
                <p><router-link to="/legal">{{$t("navigation.footer.legal")}}</router-link>
                </p>
            </div>
            <div class="col-6 text-right">
                <p>
                    Crafted on the <span title="THAT'S A MOON.">{{ phases[phase] }}</span> by <span v-html="$t('navigation.footer.craftedBy')"/>.
                </p>
            </div>
        </div>
    </footer>
</template>