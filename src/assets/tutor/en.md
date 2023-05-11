<!-- remember to have some comment lines in front of the first H§ -->
### Application Structure

**Warning: Contains automatically translated content**

There are 7 pages. You might be most interested in [stories](/instructions#stories), [tutorial](/instructions#tutorial) and [workspace](/instructions#workspace), but we will decribe all in order as they appear in the menu.

<!-- 
There are 7 levels

  * ![](/img/tutor/coffee.png) General Information
  * ![](/img/tutor/opendata.png) Open Data
  * ![](/img/tutor/stories.png) Stories 
  * ![](/img/tutor/tutorial.png) Tutorial 
  * ![](/img/tutor/workspace.png) Workspace 
  * ![](/img/tutor/advanced.png) Advanced 
  * ![](/img/tutor/account.png) Account 

-->

### About Daten.Cafe

<img src="/img/tutor/coffee.png" class="large">

A brief introduction to the goals and the intended audience of Daten.Cafe

### Open Data

<img src="/img/tutor/opendata.png" class="large">

Introduction to and overview of Open-Data concepts, data sources and applications. This sections is still completely missing, sorry.

### Stories
##### {@id=stories} X

<img src="/img/tutor/stories.png" class="large">

Data stories and examples. We have only one useable story yet, try it out. 

Create your own storied and share with your friends and collegues. Just pass on the file you can download from the workspace.


### Tutorial
##### {@id=tutorial} X

<img src="/img/tutor/tutorial.png" class="large">

The tutorial section. Your are right here ...

### Workspace
##### {@id=workspace} X

<img src="/img/tutor/workspace.png" class="large">

the workspace has 2 regions. The flow editor to the left or top (on mobile) and the visualization
pane to the right or bottom. You create your workflow in the flow editor.

Use the buttons 

  * ![](/img/tutor/chart.png) Chart and
  * ![](/img/tutor/flow.png) Flow

to switch displays on small screens.



#### Toolbar

The toolbar provides you with all required utilities, in particular:

<img src="/img/tutor/toolbar-empty.png" class="wide">

  * ![](/img/tutor/help.png) Help
  * ![](/img/tutor/settings.png) Settings
  * ![](/img/tutor/editStory.png) Edit story
  * ![](/img/tutor/upload.png) Upload workflow 
  * ![](/img/tutor/download.png) Download workflow 
  * ![](/img/tutor/trash.png) Clear 
  * ![](/img/tutor/newItem.png) New workflow item 

#### Settings

Currently, you can adjust the following settings:

  * GDPR: SOme of the tools like external data access and maps might not be GDPR compliant. There is nothing we con da about unless you are logged-in. We need your consent here..
  * Include data: the resulting flow file is smaller when you omit the data. You can even send it by email.
  * Options: By default you see only the fundamental tools. This makes the toolbox less cluttered. 

#### Flow

On your first visit you might want to start with an example story from the [story page](/stories). 
Download a story to your computer and upload it to the Workspace with the toolbar *upload*

This is how story1 flow looks like: ![](/assets/stories/story1.png)

You can inspect and modify the example or start an entirely new flow. (Click the *trash* button for a fresh start.) 


Select item(s) from toolbar *new item*. Item will appear on the flow pane.
Click and drag items accros.

Drag the background to move view. Use mouse scroll-ctrl or touch guestures
to zoom in and out. 

Long click on item will open context menu. Options will be from 

 * Configure
 * Connect
 * Delete

![](/img/tutor/node-long-click.png)

Not all options will be available on all items.

Actual configuration options depend on node type, example *random generator*

![](/img/tutor/node-config.png)

You may connect first, or configure first, doesn't matter. 

Click *connect* to start a connection. Move the mouse a bit away from the source node. 
An intermediate connection line should appear.

![](/img/tutor/edge-connect-in-progress.png)

Move to the target node and click.

You might be asked which port to connect to. Select A or B
![](/img/tutor/edge-connect-final.png)

When done, you should see a new connection
![](/img/tutor/edge-connect-finish.png)

When you add a visualization element (one of the *plot* items), it will be added to the visualization pane.
You can match flow items and visualization items by their names.

A very small flow with two output elements would look like so, for example:

![](/img/tutor/miniflow.png)


![](/img/tutor/chartplot.png)

![](/img/tutor/tableplot.png)

Scroll the visualization pane to see all charts.

 * Click ![](/img/tutor/editStory.png) to add a description to your story. 
 * You can download your flow and story with ![](/img/tutor/download.png). The file contains all information, so
you may share it with other e.g. by email. We also collect interesting stories. Check the story page ![](/img/tutor/stories.png) to see other work.





### Advanced

<img src="/img/tutor/advanced.png" class="large">

Collection of some ideas on how to proceed once you have enjoyed some stories.

### Account

<img src="/img/tutor/account.png" class="large">

Normally, you don't need to login to use the **Daten.Cafe** application

#### **HOWEVER !!!** 

there is a fundamental problem with all browser-based data tools

**CORS: Cross-Origin-Resource-Sharing**

Let's explain

 * You access this application from [https://daten.cafe](https://daten.cafe)
 * You create a flow which wants to fetch some data e.g. from [https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/ea8303b4-0494-4f95-b624-f695753d1a2c/download/altersstruktur-der-bevolkerung-65-bis-unter-75-jahrige-nach-geschlecht.csv](https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/ea8303b4-0494-4f95-b624-f695753d1a2c/download/altersstruktur-der-bevolkerung-65-bis-unter-75-jahrige-nach-geschlecht.csv) 
 * This data is kept on a so called "open-data protal" and should therefore for freely accessible to anyone. 
 * Now, your browser (Firefox, Safari, Chrome, whatsoever) detects that this is a different domain than the one you loaded the application from.
 * This fact triggers the CORS mechanism:
    * Instead of just saying: "hey, give me the data" your browser says "Hello, I'm Daten.Cafe and I want to know if you would give the data to me if I wanted".  Unfortunately, many servers do not understand polite questions. As a result, we don't get access, although the server is perfectly fine with providing its data to anybody - provided he doesn't ask lengthy questions.
 * There are 2 solutions to circumvent this problem:
    * Using a CORS-proxy server. This means, we send our request to another server which we are good friends with and ask it to get the data for us. This can be done in the background - provided your are good friends with the proxy server. And for this you will need the account and log in. Normally we will provide registration once you do a workshop with us.
    * We can force the browser to download the requested file to your machine locally (btw, this is what happens when you click on the link above). Once that is done, you can upload the file to your workflow. This is less convenient, as it requires manual interactions from your (download the file and upload the file). But on the other hand, you can do what you want and Daten.Cafe is an educational tool in the first place, not a high-end data-science application. So you're good anyway.

CORS is a good feature in principle. It's just that many servers are not prepared to receive "polite" data requests from browsers. They didn't do this in the old days.










