# Columbia Front
Columbia-Front is a graphical client for Columbia-API. Written in VueJS, it allows to perform a lot of functionality in a comfortable environment. For users, it allows to perform standard operations, like searching, viewing history or editing account information, like password or email address. For administrators and moderators, it enables to manage contexts, users, definitions and terms in a graphical environment. Also, this client includes a mechanism to perform an CSV import into the glossary. Depending on the configuration of the API, users will be able to register by themselves on the platform.

As this project is in VueJS, the client work as a SPA (Single-Page application), which provides a good user experience. For theming, we are using a customized bootstrap. The client is running on the server through a Springboot project, which enables to use Zuul to do proxy-forwarding and avoiding potential CORS issues with OAuth2 servers. Also, it makes us enable to hide secrets (like API-key) and avoid recursive or loop calls on client, which may produce a network overflow.

Finally, it’s important to notice that for several reasons (keep it simple for maintaining and deploying), we decided to not to use NPM. This is a deliberate decision.

# Installation
## Through Docker
1.	Download the file `Dockerfile` and `src/ressources/application.yml` , and copy them in a folder.
2.	Edit the `application.yml` file with your own configuration
3.	Run the Dockerfile: `docker build --no-cache -t="columbia_front:latest" ./`
4.	Create and run a container: `docker create --name="columbia_front" -p 80:80 columbia_front:latest` 
## Standalone (through a release)
1.	Download the jarfile
2.	Download file `src/ressources/application.yml`, edit him and copy him on the same directory than the jarfile
3.	Run `java -jar ./jarfile.jar`
## Standalone (building)
1.	Download the repository
2.	Edit the configuration as you like
3.	Compile the project (main class: `com.almerys.columbia.front.FrontApplication`)
4.	In folder “target”, you will find and .jar version of the app. Run with `java -jar ./jarfile.jar`

# Acknowledgment
Program by [@Artheriom](https://github.com/Artheriom/) and [@leChaps](https://github.com/lechaps), created for [@be-ys](https://github.com/be-ys). This program was built for internal usage and was ported to opensource. For this reason, some parts of the code may be different than the original.

Special thanks to all the peoples and teams who created awesome libraries for [VueJS]( https://vuejs.org/) and JS (and the authors of VueJS themselves) : [Axios]( https://github.com/axios/axios), [lodash]( https://lodash.com/), [PapaParse]( https://www.papaparse.com/), [Notifications](https://vuejsexamples.com/vuejs-2-notification-center/), [VueTags](http://www.vue-tags-input.com/#/).
# Licence
Distributed under [MIT](https://opensource.org/licenses/MIT) Licence
