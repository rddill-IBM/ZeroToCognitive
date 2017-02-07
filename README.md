# ZeroToCognitive

This is the tutorial site for the Zero to Cognitive Series. Each chapter in the Tutorial is a completely self contained folder. The chapter structure is:    


1). The Story, Architecture for this app

2). Setting up Bluemix

3). Building your first Watson App					  (Watson Speech to Text)  
    demo: https://z2c-c03.mybluemix.net/

4). Getting Watson to talk back							  (Watson Text to Speech)  
    demo: https://z2c-c04.mybluemix.net/

5). Understanding Classifiers									(Watson NLC)  
    demo: https://z2c-c05.mybluemix.net/

6). Creating a custom dialog with Watson		  (custom Q&A)  
    demo: https://z2c-c06.mybluemix.net/

7). SSL, https: sessions and users				    (set up security, use cloudant for sessionStore, manage user profiles)  
    demo: https://z2c-c07.mybluemix.net/

8). Understanding the Alchemy	APIs		  		  (Watson Alchemy - using news and text)  
    demo: https://z2c-c08.mybluemix.net/

9). Alchemy Image				                      (Watson Alchemy - analyzing images)  
    demo: https://z2c-c09.mybluemix.net/

10). Watson Conversations                     (Watson Conversations)  
    demo: https://z2c-c10.mybluemix.net/

11). Finding Answers                					(Document Conversion, Retrieve And Rank)  
    demo: https://z2c-c11.mybluemix.net/

12). How do I get started on my client app?		Design Thinking, Stories, Architecture, Keeping it simple 

If you are using IBM Public Bluemix for this tutorial series, IBM is introducing a significant change on January 2nd, moving from DEA (Droplet Execution Environment) to Diego. The tutorial will run without change in this new environment. There are two things you need to understand with this change:

A). VCAP_APP_HOST and VCAP_APP_PORT are no longer available (the apps in the tutorial don't use them, but you might)

B). The upload process changes. You must update your CLI (command line interface) to support Diego. The changes to your CLI are documented here: https://github.com/cloudfoundry-incubator/Diego-Enabler , which tells you to execute the following two commands from your command (terminal) prompt:

    cf add-plugin-repo CF-Community https://plugins.cloudfoundry.org/
    cf install-plugin Diego-Enabler -r CF-Community

Once you have done that, you will find that there is a new exec in each of the folders: `cf-diego`. This exec reads your manifest.yml file for the name of your application and then issues the appropriate cloud foundry (cf) commands and also enables Diego. I've written this exec because now, instead of issuing a single cf push command, you have to issue three commands. This exec issues all three for your automatically.

If you want to resynchronize your fork with this master repository to get all of the latest updates. (First) push (`git push`) your latest work to your personal repository, (then) execute the following commands:

    git checkout master
    git pull git@github.com:ZeroToCognitive.git
    git push origin master

The `git checkout master` command ensures that your local copy of your personal repository is pointing to the master branch of your local repository. This is the default branch.

The `git pull git@github.com:ZeroToCognitive.git` command goes to this repository and brings down all changed files and adds them to your local repository.

The `git push origin master` command updates your personal repository on enterprise github with the latest updates you've pulled down from the master repository.
