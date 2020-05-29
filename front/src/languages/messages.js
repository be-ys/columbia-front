const messages = {
    fr: {
        terms: {
            resultList: {
                unknownTermMessage: "Désolé, ce terme est inconnu",
                unknownTermMessageModerator: "... pour le moment ?",
                addTermButton: "Ajouter un terme"
            },
            randomTerm: {
                infoTooltip: "En attendant votre recherche, nous avons magiquement (et un peu au hasard) trouvé ce mot",
                newWordTooltip: "Un autre ?"
            },
            definitionContent: {
                noDefinition: "Désolé, aucune définition pour ce terme n'est encore présent dans la base de données.",
                addDefinitionButton: "Ajouter une définition"
            }
        },

        sidebar: {
            searchMode: {
                sidebarStatistics: {
                    title: "Statistiques",
                    contentStat: "<b>{0}</b> définitions réparties dans <b>{1}</b> contextes pour <b>{2}</b> termes",
                    userStat: "<b>{n}</b> actifs",
                    definitionStat: "<b>{n}</b> définitions lues"
                },
                sidebarNewsletterRegistration: {
                    title: "Restez en orbite",
                    infoText: "Vous recevrez chaque vendredi la liste des modifications du glossaire",
                    invalidEmail: "L'adresse mail que vous avez saisie n'est pas valide."
                },
                sidebarLastModifications: {
                    title: "Dernières modifications",
                    noHistory: "Aucune modification n'a été effectuée sur Columbia.",
                    inContext: "dans le contexte",
                    readMore: "En lire +"
                }
            },
            dictionaryMode: {
                letterSelector: {
                    all: "Tous"
                },
                contextSelector: {
                    all: "Tout les contextes"
                },
                information: {
                    title: "Mode dictionnaire",
                    content:
                        "<ul>" +
                        "  <li>Le mode dictionnaire vous permet de découvrir les termes d'un contexte précis.</li>" +
                        "  <li>Il n'y a aucun héritage entre les contextes dans ce mode.</li>" +
                        "</ul>"
                }
            }
        },

        newsletter: {
            newsletterRegistrator: {
                checkLegalMentions: "Avant de vous inscrire, merci de consulter nos conditions générales d'utilisation " +
                    "et notre politique de confidentialité.",
                registerButton: "S'abonner",
                updateButton: "Mettre à jour",
                unregisterButton: "Se désinscrire",
                subtitle: "Ne rien sélectionner permet de s'abonner à l'ensemble des contextes disponibles.",
                title: "Abonnements - {0}",
                toaster: {
                    InvalidToken: "Le token ne correspond à aucun mail dans notre base de données",
                    InvalidMail: "L'adresse mail saisie n'est pas valide.",
                    Unregistered: "L'adresse mail a bien été supprimée de notre base.",
                    UnregisterError: "L'adresse mail n'a pas pu être supprimée. Si le problème persiste, contactez-nous",
                    PendingRegistration: "Inscription en cours...",
                    Registered: "Vous recevrez tout les vendredi matin un récapitulatif de la semaine pour les contextes sélectionnés.",
                    RegisterError: "L'adresse mail n'a pas pu être ajoutée. Si vous êtes déjà inscrit, veuillez utiliser le lien envoyé dans les mails.",
                    Updated: "L'inscription à bien été mise à jour.",
                    UpdateError: "L'adresse mail n'a pas pu être mise à jour. Si le problème persiste, veuillez nous contacter."
                }
            }
        },

        navigation: {
            footer: {
                legal: "Copyright © 2020 - Columbia - Mentions légales",
                craftedBy: "the <a href=\"https://be-ys.com/\" target=\"_blank\">be-ys Enterprise Architecture Team"
            },
            topMenu: {
                toaster: {
                    sendMail: "Tentative d'envoi du mail en cours...",
                    mailSent: "Si votre utilisateur est enregistré dans notre base de données, vous allez recevoir sous peu un mail de réinitialisation",
                    connected: "Bienvenue {0}",
                    disconnected: "Votre session a bien été terminée, à bientôt sur Columbia !"
                },
                searchMode: "Mode recherche",
                dictionaryMode: "Mode dictionnaire",
                administration: "Espace Admin",
                contextManagement: "Gestion des contextes",
                userManagement: "Gestion des utilisateurs",
                importCSV: "Importer un CSV",
                logout: "Déconnexion",
                login: "Connexion",
                localLogin: "Connexion locale",
                oauthLogin: "Connexion {0}",
                createAccount: "Créer un compte local",
                lostPassword: "Mot de passe oublié ?",
                loginAwait: "Connexion...",
                invalidLogin: "Identifiants invalides.",
                username: "Identifiant",
                password: "Mot de passe"
            }
        },

        maintenance: {
            maintenance: {
                title: "Columbia - Difficultés techniques",
                information: "Une erreur est survenue lors du chargement de la configuration de Columbia.<br />" +
                    "Ne paniquez pas, ce n'est pas de votre faute ! Une nouvelle tentative va être effectuée dans <b>{0}</b> secondes.<br />" +
                    "Si la situation persiste, contactez le support.",
                thanksTo: "Merci à Carl Schooff, Elliot Geno, Chris Gannon et Alexis Arnould pour l'animation de maintenance.",

                toaster: {
                    error: "Echec lors de l'obtention de la configuration. Nouvelle tentative dans {0} secondes...",
                    success: "Configuration obtenue auprès du serveur ! Redirection vers l'accueil.",
                }
            }
        },

        history: {
            historyEntry: {
                title: "Définition {0} le {1} : {2}",
                sub: "Contexte : {0}",
                added: "ajoutée",
                edited: "modifiée"
            }
        },

        search: {
            search: {
                search: "Rechercher..."
            }
        },

        editors: {
            term: {
                toaster: {
                    updatedTerm: "Le terme a bien été mis à jour.",
                    updateError: "Le terme n'a pas pu être mis à jour.",
                    deletedTerm: "Le terme a bien été supprimé.",
                    deleteError: "Erreur lors de la suppression du terme.",
                    created: "Le terme a bien été créé.",
                    createError: "Erreur lors  de la création du terme.",
                },
                editTitle: "Editer le terme {0}",
                alreadyInBase: "Ce terme existe déjà dans la base de données.",
                updateButton: "Mettre à jour le terme",
                createTitle: "Créer le terme {0}",
                createButton: "Créer le terme",
                abbreviations: "Abréviations",
                cancelButton: "Annuler",
                deleteTitle: "Supprimer le terme {0}",
                deleteContent: "Voulez vous supprimer le terme {0} ? Cette action est irréversible et supprimera toutes les définitions associées.",
                deleteButton: "Supprimer le terme",
            },
            definition: {
                create: {
                    toaster: {
                        created: "La définition a bien été créée",
                        createError: "Une erreur est survenue lors de la création de la définition"
                    },
                    title: "Créer une définition - {0}",
                    contextLabel: "Contexte de la définition",
                    cancelButton: "Annuler",
                    createButton: "Créer la définition",
                    gdprDescription: "Terme RGPD : Cochez la case si le terme implique un traitement de données personnelles.",
                },
                remove: {
                    toaster: {
                        deleted: "La définition a bien été supprimée",
                        deleteError: "La définition n'a pas pu être supprimée"
                    },
                    title: "Supprimer une définition",
                    content: "Êtes-vous sûr de vouloir supprimer la définition {0} dans le contexte {1} ? Cette action est irréversible.",
                    cancelButton: "Annuler",
                    deleteButton: "Supprimer la définition"
                },
                edit: {
                    toaster: {
                        updated: "La définition a bien été mise à jour",
                        updateError: "La définition n'a pas pu être mise à jour"
                    },
                    title: "Editer la définition : {0} dans {1}",
                    gdprDescription: "Terme RGPD : Cochez la case si le terme implique un traitement de données personnelles.",
                    cancelButton: "Annuler",
                    updateButton: "Mettre à jour la définition"
                },
                move: {
                    toaster: {
                        moved: "La définition a bien été déplacée.",
                        removeError: "La définition n'a pas pu être supprimée de l'ancien contexte.",
                        moveError: "La définition n'a pas pu être déplacée."
                    },
                    title: "Déplacer la définition",
                    content: "Vous déplacez la définition du terme {0} du contexte {1}. Sélectionnez la nouvelle destination.",
                    cancelButton: "Annuler",
                    moveButton: "Déplacer la définition",
                    newContextLabel: "Nouveau contexte de la définition :",
                }
            }
        },

        dictionary: {
            dictionary: {
                title: "Termes trouvés",
                noTermFound: "Aucun terme ne correspond à votre recherche :-("
            }
        },

        csvImporter: {
            csvImporter: {
                title: "Importer un fichier CSV",
                pleaseLogin: "Veuillez vous connecter avec un compte Administrateur ou Glossateur pour effectuer cette action."
            },
            upload: {
                startUpload: {
                    uploadingTitle: "Import en cours, ne fermez pas cette page.",
                    uploadingSubtitle: "Importation en cours... {0} restants",
                    finishedTitle: "L'import est terminé.",
                    finishedSubtitle: "{0} définitions envoyées. {1} erreurs",
                    table: {
                        lineNumber: "Ligne",
                        term: "Terme",
                        status: "Statut",
                    },
                    status: {
                        error: "Erreur lors de l'import",
                        success: "Définition ajoutée ou mise à jour",
                        waiting: "En attente..."
                    },
                    buttonText: "Voir le contenu du contexte",
                    buttonTooltip: "Attention : Vous quitterez la page actuelle."
                }
            },
            fileImport: {
                importFile: {
                    title: "Importer un fichier CSV",
                    description: "Envoyez un fichier au format .csv, contenant les définitions. Les valeurs doivent être séparées par des " +
                        "<b>virgules</b>, et les données textuelles doivent être entre <b>\"guillemets\"</b>. Les valeurs des champs abréviations," +
                        " synonymes, antonymes, termes connexes, sources et bibliographie doivent être séparés par des <b>virgules</b>. Les entêtes doivent êtres fournis.",
                    exampleButton: "Cliquez ici pour voir un exemple (<i>Fortement recommandé</i>)",
                    timeInformation: "L'import d'un fichier CSV peut potentiellement prendre du temps. Merci de ne pas fermer la fenêtre du navigateur pendant les opérations.",
                    badFileTitle: "Erreur de chargement !",
                    badFileDescription: "Le fichier CSV envoyé ne respecte pas les consignes d'importation. Veuillez consulter la documentation et mettre à jour" +
                        " votre fichier avant de réessayer."
                },
                dropzone: {
                    input: "Glisser/Déposer le document ou choisir un document..."
                },
                csvExample: {
                    title: "Exemple de fichier CSV",
                    example1: "Prenons l'exemple suivant :",
                    example2: "Son export CSV sera :",
                    notes: "<b>Notes :</b>" +
                        "<ul>" +
                        "<li>Le format CSV d'Excel peut-être différent de l'exemple, mais pourra être lu par le système malgré tout.</li>" +
                        "<li>Sous Excel : Fichier -> Enregistrer sous -> <b><u>CSV UTF-8</u></b>.</li>" +
                        "<li>L'ordre des colonnes n'importe pas, tant que son intitulé est respecté.</li>" +
                        "<li>Les colonnes \"Terme\" et \"Définition\" sont obligatoires. Les autres sont facultatives, mais permettent un meilleur remplissage du glossaire.</li>" +
                        "<li>Les noms de colonnes (Terme, Définition, Abréviations, ...) ne sont pas modifiables et insensibles à la casse. Respectez-les, ou l'import plantera.</li>" +
                        "<li>La colonne doit contenir 0 si le terme n'est pas RGPD, 1 s'il l'est; ou les valeurs \"Oui\" et \"Non\".</li>" +
                        "</ul>",
                    downloadExampleButton: "Télécharger un exemple",
                    cancelButton: "Annuler"

                }
            },

            editor: {
                warningBeforeImportModal: {
                    title: "Importer le fichier",
                    content: "<b>Attention</b> : Une fois l'opération démarrée, il est impossible de l'arrêter. Assurez-vous que tout les termes sont valides. " +
                        "Une fois l'opération terminée, cette page se mettra à jour pour afficher un récapitulatif des opérations effectuées.",
                    cancelButton: "Annuler",
                    startButton: "Importer les données"
                },
                editor: {
                    fileInfo: "Fichier : {0} <br /> {1} définitions",
                    forceUpdateCheckbox: "Ecraser les définitions",
                    forceUpdateTooltip: "Lorsque cette case est cochée, toute les anciennes définitions du contexte en" +
                        "conflit avec les nouvelles seront écrasées. A utiliser avec la plus grande précaution.",
                    importIn: "Importer dans",
                    selectorDefault: "Sélectionnez un contexte",
                    displayAll: "Afficher tout les termes",
                    displayErrors: "Afficher uniquement les erreurs",
                    pleaseSelectTerm: "Sélectionnez un terme à gauche pour l'éditer.",
                    importButton: "Importer les définitions"
                }
            },

            csvDefinition: {
                "term": "terme",
                "definition": "définition",
                "gdpr": "rgpd",
                "abbreviations": "abréviations",
                "synonymsTermList": "synonymes",
                "antonymsTermList": "antonymes",
                "relatedTermList": "termes liés",
                "sources": "sources",
                "bibliography": "bibliographie"
            }
        },


        admin: {
            contexts: {
                contexts: {
                    title: "Liste des contexts",
                    addContextButton: "+ Ajouter un contexte",
                    table: {
                        context: "Contexte",
                        options: "Actions"
                    }
                },
                modal: {
                    common: {
                        nameLabel: "Nom du contexte :",
                        parentContextLabel: "Contexte parent :",
                        defaultContextValue: "Aucun (racine)",
                        descriptionLabel: "Description...",
                        cancelButton: "Annuler",
                        errorContextAlreadyExist : "Le contexte existe déjà."
                    },
                    create: {
                        title: "Créer un contexte",
                        createButton: "Créer le contexte",
                        toaster: {
                            created: "Le contexte a bien été créé",
                            createError: "Le contexte n'a pas pu être créé",
                        }
                    },
                    edit: {
                        title: "Mettre à jour un contexte",
                        updateButton: "Mettre à jour le contexte",
                        toaster: {
                                updated: "Le contexte a été mis à jour",
                                updateError: "Le contexte n'a pas pu être mis à jour"
                        }
                    },
                    remove: {
                        toaster: {
                            removed: "Le contexte a bien été supprimé",
                            removeError: "Le contexte n'a pas pu être supprimée"
                        },
                        title: "Supprimer le contexte {0}",
                        content: "Voulez vous supprimer le contexte {0} ? Cette action est irréversible et supprimera toutes les définitions associées.",
                        removeButton: "Supprimer le contexte"
                    }
                }
            },
            users: {
                users: {
                    title: "Liste des utilisateurs",
                    addUserButton: "+ Ajouter un utilisateur",
                    table: {
                        username: "Nom d'utilisateur",
                        role: "Rôle",
                        domain: "Domaine",
                        options: "Actions"
                    }
                },
                modal: {
                    common: {
                        domainLabel: "Type d'utilisateur",
                        localAccount: "Compte local",
                        oauthAccount: "Compte {0}",
                        activatedLabel: "Utilisateur activé (peut se connecter)",
                        usernameLabel: "Nom d'utilisateur :",
                        emailLabel: "Adresse Mail :",
                        passwordLabel: "Mot de passe :",
                        roleLabel: "Rôle de l'utilisateur",
                        cancelButton: "Annuler",
                    },
                    remove: {
                        title: "Supprimer l'utilisateur {0}",
                        content: "Voulez vous supprimer l'utilisateur {0} ? Ses contributions ne seront pas effacées.",
                        deleteButton: "Supprimer l'utilisateur",
                        toaster: {
                            deleted: "L'utilisateur a bien été supprimé.",
                            deleteError: "L'utilisateur n'a pas pu être supprimé."
                        }
                    },
                    edit: {
                        title: "Editer l'utilisateur",
                        updateButton: "Mettre à jour l'utilisateur",
                        toaster: {
                            updated: "L'utilisateur a bien été mis à jour",
                            updateError: "Erreur lors de la mise à jour de l'utilisateur"
                        }
                    },

                    create: {
                        title: "Créer un utilisateur",
                        createButton: "Créer l'utilisateur",
                        toaster: {
                            created: "L'utilisateur a bien été créé.",
                            createError: "Erreur lors de la création de l'utilisateur"
                        }
                    }
                }
            }
        },

        account: {
            activateAccount: {
                loading: "Chargement en cours...",
                toaster: {
                    activated: "Le compte a été activé, vous pouvez désormais vous connecter.",
                    activateError: "Erreur lors de l'activation du compte",
                    invalidToken: "Le token fourni est invalide."
                }
            },
            createAccount: {
                toaster: {
                    closedRegistration : "Les incriptions ne sont pas ouvertes sur ce serveur.",
                    alreadyConnected: "Impossible de vous inscrire : Vous êtes déjà connecté.",
                    registered: "Inscription réussie, vous allez recevoir un mail pour activer votre compte.",
                    registerError: "Erreur d'inscription. Le nom d'utilisateur est déjà utilisé, ou l'adresse mail est invalide."
                },
                title: "Inscription",
                usernameLabel: "Nom d'utilisateur :",
                emailLabel: "Adresse mail :",
                passwordLabel : "Mot de passe :",
                cguLabel : "En m'inscrivant, je reconnais avoir lu et accepté les mentions légales et la politique de confidentialité",
                registerButton : "Créer le compte"
            },
            lostPassword: {
                toaster: {
                    updated: "Mot de passe mis à jour, vous pouvez vous connecter avec vos nouveaux identifiants.",
                    updateError: "Le token est invalide."
                },
                title: "Réinitialiser votre mot de passe",
                introduction: "Veuillez saisir le nouveau mot de passe à associer au compte ayant pour clef {0}.",
                passwordPlaceholder: "Nouveau mot de passe",
                repeatPlaceholder: "Confirmez",
                updateButton: "Réinitialiser le mot de passe",
                passwordDiffers: "Les mots de passe saisis sont différents.",
                passwordOk : "Les mots de passe sont identiques. Prêt à mettre à jour !",
                alreadyConnected: "Vous êtes déjà connecté. Pour modifier votre mot de passe, merci d'utiliser la page de votre profil.",
            },
            profile: {
                toaster: {
                    mailUpdated: "Adresse mail mise à jour !",
                    mailError: "Erreur lors de la mise à jour. Vérifiez que l'adresse mail est valide.",
                    passwordUpdated: "Mot de passe mis à jour !",
                    passwordError: "Erreur lors de la mise à jour.",
                    waitingDownload: "Préparation du téléchargement...",
                    downloadSuccess: "Le téléchargement a démarré...",
                    downloadError: "Erreur lors du téléchargement."
                },
                title: "Gestion du compte",
                oauthInformation : "Ce compte est en délégation depuis l'authentification centralisée. Pour éditer vos données de " +
                    "connexion, mettez à jour vos identifiants centralisés.",
                emailLabel: "Adresse mail : ",
                passwordLabel: "Mot de passe : ",
                passwordPlaceholder: "Nouveau mot de passe",
                notLoggedIn: "Vous n'êtes pas connecté. Veuillez vous connecter avec le menu déroulant situé en haut à droite de l'écran.",
                moderatorRightTitle: "Liste des droits de glossateur",
            }
        },
        words: {
            gdprTerm: "Terme RGPD",
            synonyms: "Synonymes",
            antonyms: "Antonymes",
            definition: "Définition",
            relatedTerms: "Termes connexes",
            sources: "Sources",
            bibliography: "Bibliographie",
            term: "Terme",
            added: "Ajouté",
            edited: "Modifié",
            deleted: "Supprimé"
        },

        errors: {
            onModuleLoed: "Erreur lors du chargement du contenu."
        },

        toaster: {
            success: "Succès",
            warning: "Attention",
            alert: "Erreur !",
            disconnected: "Votre session a expirée, veuillez vous reconnecter."
        }
    }
};

export default messages;