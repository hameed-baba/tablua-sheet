import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/css/font.css";
import "./assets/css/style.css";
import "./assets/css/main-style.css";
import mixins from "./services/mixins";

import { Form, Field, ErrorMessage } from "vee-validate";
import NoResultsRow from "./components/public/NoResultsRow.vue";

const app = createApp(App);

// User defined global components
app.component("vee-form", Form, { classes: true }, Form);
app.component("vee-form-field", Field);
app.component("vee-form-error", ErrorMessage);
app.component("no-results-row", NoResultsRow);

app.use(createPinia());
app.use(router);
app.mixin(mixins);

app.mount("#app");
