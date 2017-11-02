# Chapter 2: Setting up your workstation for IBM Cloud (bluemix)

[Return to Table of Contents](../README.md)

In this chapter, we will do the following things: 
 - Create your IBM Cloud account
 - Install Git and GitHub Desktop on your workstation
 - Create your first GitHub Repository
 - Tell Cloud Foundry where your IBM Cloud application will go

## Create your IBM Cloud account. 

We are using the publicly available IBM Cloud, which at this writing has instances located in North America, Germany, Australia and the UK.
The link for IBM Cloud, or Bluemix as it was formerly known, is http://console.bluemix.net, this URL will bring you to this page: 
![ScreenShot](/assets/IBM_Cloud_signup.png)

At this point, you can either sign up for IBM Cloud, or log in. If you already have an id on IBM Cloud, then you can go 
to one of the following regional links: 
 - [Americas](https://console.ng.bluemix.net)
 - [Europe](https://console.eu-de.bluemix.net)
 - [UK](https://console.eu-gb.bluemix.net)
 - [Australia](https://console.au-syd.bluemix.net)

Once you've gotten you IBM Cloud account, log in and do the following things to set it up:

 - Name your organization
 This can be any name you choose, but must be globally unique inside IBM Cloud. The services which you can load and run are 
 defined at the organization level.
 - Make a ‘space’
 A space in IBM Cloud is where you will create services and where you will load and deploy applications. You can have multiple
 spaces within an organization and can invite other IBM Cloud members to join your organization. When you invite other in
 they are invited to one or more of your spaces with a specific role in each space. This is explained fully in the IBM Cloud
 documentation. 
 - Create a Watson Speech to Text service, which we will use in Chapter 3
 - Install the Cloud Foundry CLI (Command Line Repository) on your workstation. Follow the instructions [here](https://github.com/cloudfoundry/cli#downloads)


## Install Git and (unless you're on linux) GitHub Desktop on your local computer
The installation process for these tools is different, depending on what operating system you're using. Follow the guidelines
for your operating system.
 - Git: https://git-scm.com/ 
 - Git Installers: https://git-scm.com/downloads 
 - Git Documentation here: https://git-scm.com/doc

## Get the Zero To Cognitive Repository![Fork](/assets/Fork.jpg)![IBM_Cloud_signup](/assets/IBM_Cloud_signup.png)
The Zero to Cognitive repository, which you're reading right now, is on public github. I encourage you to use the fork process to 
create your own personal version of this repository. That way you can make updates to your own code and share your code with others. 
This repository will not accept updates. 
### Fork the master Repository
To fork the repository, go to this [link](https://github.com/rddill-IBM/ZeroToCognitive).
When you do that, you will see a page that looks similar to the following: 
![ScreenShot](/assets/Fork.jpg)
Please note that on the bottom left, the word 'master' is showing on the branch button. You definitely want that! Also, you can see that 
the fork button is circled on the top right corner. Click that button. When you do so, it will either automatically create a copy of 
this repository in your git space, or it will ask you where to put it if you have multiple git spaces or organizations 
associated with your id. 
### Clone your personal copy of the master to your workstation
Once you have successfully forked this repository, then, on your own personal copy, click the green clone button shown above. If 
you have github desktop installed, when you click the button you will be asked if you want to use github desktop. Otherwise
use the copy function to copy the git URL and then open a window on your workstation. 
### Linux and OSX
 - open a Terminal Window. 
### Windows
 - open a Git Bash Shell (this is an option on your start command and may be an icon on your desktop)
### everyone
If you have already created a folder to hold your github clones, then just navigate to that folder. If you haven't done this yet, 
then I recommend you do so. For example, on my system, I have a folder called github, located inside the Documents folder on 
my Linux and OSX systems and inside MyDocuments on Windows. 
 - navigate to your github folder from within your terminal window or git bash shell
   - e.g. ```cd ~/Documents/github```
 - type in git clone and then paste after the word 'clone ' the information which you copied from the clone button in your
 web browser. After 30 seconds or so, this entire repository will now be on your workstation. 

## Install and configure the Cloud Foundry Command Line Interface (CLI)
 - navigate to the newly cloned ZeroToCognitive folder on your system and type in:
   - ```cf target -o ‘your org name’ -s ‘your space name’```
where you replace the quoted items above with your information, without quotes

**Congratulations** You have successfully set your workstation up to work with IBM Cloud and have a great tutorial loaded onto your computer.


