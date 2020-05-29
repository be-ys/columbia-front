<script>
    export default {
        data() {
            return {
                address: process.env.VUE_APP_LEGAL_MENTIONS,
                dpo_email: process.env.VUE_APP_DPO_EMAIL
            }
        }
    }

</script>

<template>
    <div>
        <b-card>
            <b-card-header>
                <h3 class="card-title">Mentions légales</h3>
            </b-card-header>
            <b-card-text>

                <h4>Editeur du Site</h4>
                <p v-html="address"></p>

                <h4>Avertissement</h4>
                <p>L'Editeur ne saurait garantir l’exactitude, l’exhaustivité et l’adéquation des informations et
                    éléments du site avec vos besoins professionnels ou personnels.</p>
                <p>Les informations contenues dans ce service sont non contractuelles et sujettes à modification sans
                    préavis.</p>

                <h4>Liens hypertextes </h4>
                <p>L’existence de liens hypertextes vers d’autres sites internet ne constitue ni une recommandation, ni
                    une validation de ces sites et de leurs contenus par l'Editeur. Le contenu et le fonctionnement de
                    ces sites restent sous la seule et entière responsabilité du site concerné. l'Editeur décline toute
                    responsabilité quant au contenu des informations ou services fournis sur les sites.</p>
                <p>Tous les liens vers le site peuvent être librement établis. Sont naturellement exclus de cette
                    autorisation les sites diffusant des informations à caractère illicite, violent, polémique,
                    pornographique, xénophobe ou pouvant porter atteinte à la sensibilité du plus grand nombre.</p>

                <h4>Accès au site</h4>
                <p>l'Editeur se réserve le droit de modifier, de résilier, de suspendre ou d'interrompre à tout moment,
                    pour toutes raisons et à sa seule discrétion, l'accès à tout ou partie du site, y compris le
                    contenu, les fonctionnalités ou les heures de disponibilité sans avis préalable.</p>
                <p>l'Editeur n’apporte aucune garantie quant au fonctionnement du présent site de manière performante et
                    ininterrompue.</p>

                <h4>Propriété intellectuelle</h4>
                <p>Les textes, logos, pictogrammes, photographies, dessins, schémas, ainsi que toutes les œuvres
                    intellectuelles de ce site sont la propriété de l'Editeur ou de tiers, ayant autorisé l'Editeur à
                    les utiliser.</p>
                <p>Toute représentation totale ou partielle de ce site par quelque procédé que ce soit, sans
                    l'autorisation expresse de l'Editeur est interdite et constituerait une contrefaçon sanctionnée par
                    les dispositions du Code de la propriété intellectuelle.</p>
                <p>La consultation ou la réception de documents à partir du site d'l'Editeur n'entraîne aucun transfert
                    de droit de propriété intellectuelle en faveur de l'utilisateur.</p>
            </b-card-text>
        </b-card>

        <br/><br id="newsletter"/>

        <b-card>
            <b-card-header>
                <h3 class="card-title">Utilisation de votre adresse mail pour la newsletter</h3>
            </b-card-header>
            <b-card-text>

                <h4>Description de l'utilisation de vos données pour la newsletter</h4>
                <p>Votre adresse mail sera utilisée par l'éditeur à des fins de communication de la newsletter.
                    Vous pouvez vous désinscrire à tout moment en cliquant sur le lien de désabonnement prévu à cet
                    effet. Conformément à la loi Informatique et Libertés et au Règlement Général sur la Protection
                    des Données, vous disposez, en justifiant de votre identité, d’un droit d’accès, de
                    rectification, de modification, de suppression ou de portabilité des données à caractère
                    personnel vous concernant.<br/>
                    Vous pouvez également, pour des motifs légitimes, vous opposer totalement ou partiellement à
                    tout traitement de vos données, ou retirer un consentement préalablement donné.
                    Pour exercer vos droits ou pour toute question relative à ce traitement, merci de nous adresser
                    un mail à : <a :href="'mailto:'+dpo_email">{{dpo_email}}</a>, ou d'utiliser le système automatisé à
                    votre disposition, et décrit plus bas.</p>

                <h4>Traitement des données</h4>
                <p>Dans le cadre de la newsletter, le système procède à un traitement automatisé et interne de vos
                    données,
                    afin de vous envoyer les information que vous avez indiquées lors de votre inscription à la
                    newsletter.
                    L'ensemble du processus de newsletter est effectué sur les serveurs de l'Editeur, et aucun tiers ne
                    dispose de vos informations.</p>
                <p>Cependant, veuillez noter que, la communication par email n'étant pas sécurisée par nature, l'Editeur
                    décline toute responsabilité
                    en cas de compromission (interception, perte ou altération) du ou des mails envoyés depuis le
                    système de newsletter.</p>

                <h4>Désinscription de la newsletter</h4>
                <p>Afin de faciliter vos démarches, Columbia dispose d'un système automatisé de désinscription du
                    système de newsletter.
                    En bas de chaque mail reçu, vous disposez d'un lien permettant de mettre à jour ou de supprimer
                    votre inscription.
                    Une fois cliqué, le lien vous renverra sur la page de newsletter, et un bouton "Se désinscrire",
                    clairement visible, sera présent en bas de page.
                    En cliquant sur ce bouton, votre inscription à la newsletter sera supprimée, et votre adresse mail
                    cessera d'apparaître dans nos bases.
                    Toutefois, en cas de dysfonctionnement ou de questions, vous pouvez nous contacter à l'adresse
                    suivante : <a :href="'mailto:'+dpo_email">{{dpo_email}}</a>.</p>
            </b-card-text>
        </b-card>

        <br/><br/>


        <b-card>
            <b-card-header>
                <h3 class="card-title">Déclaration de confidentialité</h3>
            </b-card-header>
            <b-card-text>
                <h4>Nature des données collectées</h4>
                <p>Dans le cadre du bon fonctionnement des services, nous collectons les informations de connexion vous
                    concernant. Selon la manière de connexion, les données conservées varient :</p>
                <ul>
                    <li><b>Par OAuth2 / Connexion centralisée</b> : Nous conservons à des fins d'identification, votre
                        UUID OAuth2, ainsi que votre nom d'utilisateur.
                    </li>
                    <li><b>Par connexion indépendante</b> : Nous conservons à des fins d'identifications, votre UUID
                        généré, votre nom d'utilisateur, votre adresse mail (chiffrée en base), et votre mot de passe
                        (hashé en base).
                    </li>
                </ul>
                <h4>Communication des données personnelles à des tiers</h4>
                <p>Vos données ne font l'objet d'aucune communication à des tiers. Vous êtes toutefois informés qu'elles
                    pourront être divulguées en application d'une loi, d'un règlement ou en vertu d'une décision d'une
                    autorité réglementaire ou judiciaire compétente.</p>
                <h4>Collecte des données d'identité</h4>
                <p>La consultation du Site ne nécessite pas d'inscription ou d'identification préalable. Elle peut
                    s'effectuer sans que vous ne communiquiez de données nominatives vous concernant. Nous ne procédons
                    à aucun enregistrement de données nominatives pour la simple consultation du site.</p>
                <h4>Collecte des données du terminal & cookies</h4>
                <p>Nous utilisons, afin de vous garder connecté sur le site, plusieurs variables de session, situées
                    dans le localStorage de votre navigateur. Ces données sont indispensables au bon fonctionnement du
                    site. Lorsque vous vous déconnectez, l'ensemble de ces données sont supprimées du terminal. Nous ne
                    collectons aucune donnée depuis votre terminal.</p>
                <p>Dans le cas où vous ne vous déconnectez pas, sachez que ces informations seront conservées pour une
                    durée maximale de 7 (sept) jours calendaires à compter de la connexion.
                <p>
                <p>Dans le cas où vous refusez la collecte et l'utilisation des cookies et du localStorage, l'ensemble
                    des fonctions d'édition et de suppression du glossaire, ainsi que l'accès au compte, ne seront plus
                    utilisable.</p>

                <h4>Conservation des données anonymisées au delà de la relation contractuelle / après la suppression du
                    compte</h4>
                <p>Nous conservons les données personnelles pour la durée strictement nécessaire à la réalisation des
                    finalités décrites dans les présentes CGU. Au-delà de cette durée, elles seront anonymisées et
                    conservées à des fins exclusivement statistiques et ne donneront lieu à aucune exploitation, de
                    quelque nature que ce soit.</p>

                <h4>Suppression des données après suppression du compte</h4>
                <p>Des moyens de purge de données sont mis en place afin d'en prévoir la suppression effective dès lors
                    que la durée de conservation ou d'archivage nécessaire à l'accomplissement des finalités déterminées
                    ou imposées est atteinte. Conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique,
                    aux fichiers et aux libertés, vous disposez par ailleurs d'un droit de suppression sur vos données
                    que vous pouvez exercer à tout moment en prenant contact avec l'Éditeur.</p>

                <h4>Suppression des données après 1 an d'inactivité</h4>
                <p>Pour des raisons de sécurité, si vous ne vous êtes pas authentifié sur le Site pendant une période
                    d'un an, vos données seront supprimées de nos bases de données.</p>

                <h4>Suppression du compte à la demande</h4>
                <p>L'Utilisateur a la possibilité de supprimer son Compte à tout moment, par simple demande à
                    l'Éditeur. </p>


                <h4>Indications en cas de faille de sécurité décelée par l'Éditeur</h4>

                <p>Nous nous engageons à mettre en oeuvre toutes les mesures techniques et organisationnelles
                    appropriées afin de garantir un niveau de sécurité adapté au regard des risques d'accès accidentels,
                    non autorisés ou illégaux, de divulgation, d'altération, de perte ou encore de destruction des
                    données personnelles vous concernant. Dans l'éventualité où nous prendrions connaissance d'un accès
                    illégal aux données personnelles vous concernant stockées sur nos serveurs ou ceux de nos
                    prestataires, ou d'un accès non autorisé ayant pour conséquence la réalisation des risques
                    identifiés ci-dessus, nous nous engageons à :</p>
                <ul>
                    <li>Vous notifier l'incident dans les plus brefs délais ;</li>
                    <li>Examiner les causes de l'incident et vous en informer ;</li>
                    <li>Prendre les mesures nécessaires dans la limite du raisonnable afin d'amoindrir les effets
                        négatifs et préjudices pouvant résulter dudit incident
                    </li>
                </ul>
                <p>En aucun cas les engagements définis au point ci-dessus relatifs à la notification en cas de faille
                    de sécurité ne peuvent être assimilés à une quelconque reconnaissance de faute ou de responsabilité
                    quant à la survenance de l'incident en question. </p>


                <h4>Transfert des données personnelles à l'étranger</h4>
                <p>L'Éditeur s'engage à ne pas transférer les données personnelles de ses Utilisateurs en dehors de
                    l'Union européenne.</p>

                <h4>Modification des CGU et de la politique de confidentialité</h4>
                <p>En cas de modification des présentes CGU, engagement de ne pas baisser le niveau de confidentialité
                    de manière substantielle sans l'information préalable des personnes concernées, nous nous engageons
                    à vous informer en cas de modification substantielle des présentes CGU, et à ne pas baisser le
                    niveau de confidentialité de vos données de manière substantielle sans vous en informer et obtenir
                    votre consentement.</p>

                <h4>Droit applicable et modalités de recours</h4>
                <p>Les présentes CGU et votre utilisation du Site sont régies et interprétées conformément aux lois de
                    France, et notamment à la Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et
                    aux libertés. Le choix de la loi applicable ne porte pas atteinte à vos droits en tant que
                    consommateur conformément à la loi applicable de votre lieu de résidence. Si vous êtes un
                    consommateur, vous et nous acceptons de se soumettre à la compétence non-exclusive des juridictions
                    françaises, ce qui signifie que vous pouvez engager une action relative aux présentes CGU en France
                    ou dans le pays de l'UE dans lequel vous vivez. Si vous êtes un professionnel, toutes les actions à
                    notre encontre doivent être engagées devant une juridiction en France.</p>
                <p>En cas de litige, les parties chercheront une solution amiable avant toute action judiciaire. En cas
                    d'échec de ces tentatives, toutes contestations à la validité, l'interprétation et / ou l'exécution
                    des présentes CGU devront être portées même en cas de pluralité des défendeurs ou d'appel en
                    garantie, devant les tribunaux français.</p>

                <h4>Portabilité des données</h4>
                <p>L'Éditeur s'engage à vous offrir la possibilité de vous faire restituer l'ensemble des données vous
                    concernant sur simple demande. L'Utilisateur se voit ainsi garantir une meilleure maîtrise de ses
                    données, et garde la possibilité de les réutiliser. Ces données seront fournies dans un format
                    ouvert et aisément réutilisable.</p>

            </b-card-text>
        </b-card>
    </div>
</template>