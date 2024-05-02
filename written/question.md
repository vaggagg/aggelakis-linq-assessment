### Question 1: Plan Before You Code
- What clarifications would you need before diving into coding?

First of all, we have to decide whether the data will be rendered client side or server side. Judging from the description provided to me, however, this question would be obsolete. One other consideration , is whether the filters are going to work via the URL. For example, if a user edits the filters in a certain way and he/she wants to send it to someone else, he would do it with the use of the url. Moreover, what is the default state of this page? Would all the data be delivered? What is the default sorting? What would it be the loading state? A skeleton UI or the classic loader? How many pages there will be ?  Which of the functionalities are triggered by click or be hover? Is there going to be a refresh everytime the url or the filter changes? 

- How might you handle saving and sharing filter states?

The obvious and the most used way , in my opinion, is with the use of the URL. The main advantage is that you do not need to save the data somewhere, you just use the url to form the data. Other ways, not necessarily suggested by me, is with local storage, cookies or even save the preferences to a database ( too much ? :P). 

- How would you ensure the smallest design elements are captured?

I would need to see a mockup both in desktop and mobile versions, or even in a resolution between those two. Fonts, margins, buttons, state of buttons, transitions, colors have to be defined in all resolutions from the start in order for elements to have the behaviour needed. 

-   Any obstacles you anticipate? How would you address them?

Design wise, many things need to be addressed, like what happens when i hover on some elements. Functionality wise, the difficult part is fetching data in a optimal way. 

-   What stack would you use and why?

React or Next js would be ideal for this kind of task. With React you can have easy control of the state of elements ( filter states in our project) and mapping data arrays in html is easy and predictable in a good way. Creating an one page app, ensures the smoothness between changing states and filters. Reusability of components is easier, too.

- What folder structure would you create for you project?

It depends on the stack. If Next is used, a default folder structure is mandatory as it is the path of your project, too. In every stack , i would need a components folder, a css folder, a general functionality folder and one page folder. This can be different , depending on the stack. You can have components, both css and js together. The same applies to pages folder. 