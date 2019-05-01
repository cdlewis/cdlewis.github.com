---
layout: post
title: Powering UberEATS with React Native
description:
category:
image:
tags: [react-native, flow, redux-saga]
---

<picture>
  <source srcset="/assets/images/2017-03-28/header.webp" type="image/webp">
  <img src="/assets/images/2017-03-28/header.jpg" alt="ubereats">
</picture>

*I originally wrote this article for the [Uber engineering blog](https://eng.uber.com/ubereats-react-native/).*

With [UberEATS](https://www.ubereats.com/), our aim is to make ordering food from your favourite restaurants as seamless as requesting a ride with uberX or uberPOOL. Like launching any new product, building out a food delivery network came with its fair share of engineering triumphs and surprises. Although tasty, this new flavourful passenger (food!) also comes with its fair share of challenges. For instance, it cannot specify its preferred route or chit chat with the driver and it does require more steps at pickup and dropoff. In this article, we focus on one challenge in particular: how Uber Engineering handled introducing a third party to what had previously been a two-sided marketplace.

<!--break-->

Fortunately, we were able to get UberEATS up and running quickly by leveraging much of Uber’s existing technology stack. A trip became a delivery. Driver-partners became delivery-partners, and riders became eaters. But there was no analogous party to the restaurant, because for the past five years the assumption had been that there would only be two people involved in a single trip; not three people and one cheese pizza, order of Pad Thai, or chicken fajita.

## Building Restaurant Dashboard

![The UberEATS marketplace includes three parties: restaurants, delivery-partners and eaters. This new dynamic turns Uber’s traditional two-sided model on its head.](/assets/images/2017-03-28/figure1.png)

Restaurants need a way to communicate with both delivery-partners and eaters. At a bare minimum, the parties need to relay the:

- Placement of a new order
- Acceptance of an order
- Arrival of a delivery-partner
- Completion of an order

These four basic demands gave rise to the Restaurant Dashboard, a React/Flux single-page web application accessed through tablet devices.

![A Restaurant Dashboard showing one active order.](/assets/images/2017-03-28/figure2.png)

## Revamping Restaurant Dashboard for the Next 50 Cities

Since the standalone app’s [initial launch](https://newsroom.uber.com/canada/ubereatsapp/) in Toronto in December 2015, we have continued to work on creating an effortless, reliable interface for restaurants to use to coordinate deliveries. Over several months, it became clear to us that in order to continue improving the Restaurant Dashboard, a complete revamp would be necessary.

Our web app only provided limited access to the device, which proved to be a significant problem because it restricted our ability to communicate important information to restaurants. One example of this is that a user must interact with a web page before sound-based notifications can be cued. Restaurants are bustling with activity, so sound is a hugely important way to notify restaurant employees about the placement of a new order or when a delivery-partner has arrived to pick one up. To solve this issue, we displayed a modal each time the page was loaded in order to force user interaction. While this gave us implicit permission to play sound, it did so at the expense of the user experience.

![Restaurant Dashboard showing a modal to force user interaction and therefore enable sound.](/assets/images/2017-03-28/figure3.png)

We also needed to build some features that simply were not feasible on a web browser or were only available in a highly constrained format. For example, printing physical receipts is a given for many restaurants, but web browsers only permit the function for those that use AirPrint-compatible printers. This limitation was a great source of confusion and frustration for restaurants and engineers alike. We realised that in order to overcome this hurdle, we would need access to the hardware, which would allow us to communicate directly with printers using native SDKs provided by printer vendors.

## Evaluating React Native

While it would be premature to call React Native the silver bullet of mobile app development, it did seem to fit the UberEATS use case very well. Since the original incarnation of Restaurant Dashboard was built for the web, our team had a great deal of experience using React but limited iOS/Android exposure. There was also a wealth of knowledge about how the restaurant component of the service functioned, which we had accumulated by working on UberEATS since its inception. These considerations made React Native, which provides a platform for mobile development in the language of the web, a compelling option. It provided us with the utensils we needed to “cook” the application we wanted to near-perfection.

Multi-platform support was also a big concern for us. Currently, Uber works closely with restaurants to find tablet devices and install the Restaurant Dashboard app, but this practice may become less sustainable as UberEATS continues to expand. The driver-partner side of Uber went through a similar shift when we moved to a BYOD (bring your own device) model. By structuring the UberEATS app in a platform-agnostic manner we have the option of expanding to Android later and supporting both platforms moving forward.

For React Native to be a viable option for us, it was also important that it work within our existing mobile infrastructure and support the kinds of features that had originally prompted our move towards a native application. In order to do this, we built a ‘demo’ application tailored towards verifying critical features. This included our ability to pull in native dependencies from other teams at Uber to test functionalities, including crash reporting, user authentication, and analytics. Since these features spanned both the native Objective-C layer and the interpreted JavaScript layer, it was also a useful test of our capacity to deliver features requiring integration between these two very different environments.

Overall, the demo was able to deliver our desired outcome. Libraries like crash reporting, which could operate independently of our application’s business logic, worked out of the box. Bridging into the JavaScript layer for features such as firing analytics events also proved to be surprisingly straightforward. In hindsight, this lack of a technical barrier probably led us to rely too heavily on native libraries, and this tension between native and JavaScript functionality would go on to frame many of our later architectural decisions.

## Building a Migration Path

The initial goal was to build the bare minimum amount of scaffolding needed to get Restaurant Dashboard running natively. In order to accomplish this, we created a native navigation and authentication system along with a WebView pointing to our existing web app.

![The above diagram showcases interaction between the native and web Restaurant Dashboard Flux stores.](/assets/images/2017-03-28/figure4.png)

Network requests from the WebView were altered using NSURLProtocol in order to have the necessary authentication headers. Additional hooks were added to the window, which allowed us to update the web-based Restaurant Dashboard’s flux store by injecting JavaScript into the WebView. This gave us a lot of flexibility in terms of gradually migrating functionality.

Having this minimal viable product (MVP) effectively at feature parity allowed us to rapidly start testing on real restaurants. It also unlocked some ‘quick wins’ in terms of native functionality. We integrated with several native printer SDKs to expand the range of compatible printers beyond those supported by AirPrint. We also disabled sleep mode, something that only takes one line of native code but was impossible to do from the web.

The rest of the application could then be migrated to React Native piece-by-piece. Where possible, we aimed to make these migrations part of broader feature work rather than rewriting for the sake of rewriting.

## Defining the Architecture

As noted earlier, React Native fuses web and mobile development, allowing us to write features either natively or in JavaScript. With this functionality also comes the patterns and concepts of the mobile and web communities, respectively. This melting pot of ideas gives us more options, but also presents new challenges in terms of choosing the right abstraction.

We ultimately architected UberEATS in much the same way as we would a regular React /Redux web app, eschewing iOS patterns and modules wherever possible. Fortunately for our needs and preferences, web concepts and technologies on the whole translate quite nicely to native development.

One example of this easy translation to the web is the app’s routing functionality. On the web, Restaurant Dashboard uses the popular react-router library which enables routes to be defined declaratively, much in the same way as a View. However this system assumes the existence of URLs which tend to be lacking outside of the browser. React Native provides an imperative navigation library, which resembles the interface provided by UINavigationController.

For the sake of speed, we initially kept the react-router library with the aim of replacing the routing framework once an MVP was up and running. The non-existent URL problem is easily solved by replicating the HTML5 History API inside JavaScript, which for all intents and purposes is just a stack.

When it came time to migrate off react-router to one of the React Native libraries such as Navigator or NavigationExperimental, the new implementations did not appear to offer any compelling advantages over our current solution. It turns out that vanilla react-router is just a really awesome way of doing routing, regardless of whether you are in the browser or native.

Another key lesson from the porting process was that it is highly advantageous to minimise interaction between iOS and JavaScript and concentrate logic in the JavaScript layer. Doing so has a number of significant benefits, such as:

- Less context switching between JavaScript and Objective-C
- Increased portability (through diminished platform-specific code)
- Reduced scope for bugs

As we started work on the project, we developed a simple API for communication with the native layer. While we appreciated the advantages of keeping this layer thin, we underestimated just how much code could be kept in the React Native layer. Features such as analytics and login are fundamentally just network calls and could have been implemented in JavaScript with relative ease, whereas code that was originally written in Objective-C will need to be ported to Java in order to support Android. More likely, however, we will take the opportunity to rewrite these libraries in JavaScript so that they can be shared across platforms.

## Automatically Pushing Updates

React Native applications are bootstrapped by a small amount of Objective-C/Java code which then loads the JavaScript bundle. The bundle is shipped with the application, much like any other asset. As we have suggested, if business logic remains concentrated in the bundle, the application can be updated by loading a different JavaScript file upon launch, which is a simple process. At the native layer, the application can change the file used by the React Native bridge and request that it be reloaded.

To keep our update logic platform-agnostic, we chose to take it one step further and create a native wrapper around the bridge, allowing the JavaScript bundle itself to determine which bundle is loaded.

![Restaurant Dashboard can store up to three JavaScript bundles at any given time.](/assets/images/2017-03-28/figure5.png)

Restaurant Dashboard periodically checks for new bundles and automatically downloads them. Both the native code and the bundle code follow semantic versioning, assigning unique identification to each new deployment, and a change is considered breaking if it changes the Native – JavaScript communication interface. For example, renaming the Analytics module to AnalyticsV2 would be considered a breaking change because existing calls from the JavaScript bundle to Analytics would trigger an exception.

Of course, even with the most careful attention to semantic versioning, a bad update is still possible. In the context of UberEATS, a bad update refers to a bundle update causing Restaurant Dashboard to crash before the bundle handling logic has a chance to run. The timing of the crash would make it impossible to fix the problem by pushing a new bundle. Updates causing this type of instability will happen eventually so it is important to have a resilient system which can detect and recover from unstable builds.

One way of avoiding the deployment of bad updates is to treat every release as an experiment, which allows for a gradual rollout and, if necessary, a rollback of updates.

![The Restaurant Dashboard’s rollback process determines which bundle to load.](/assets/images/2017-03-28/figure6.png)

For the rollback process to work properly, Restaurant Dashboard needs to recognise that it has a bad bundle and then reload a ‘safe’ bundle (meaning, a bundle we know to be error-free, such as the bundle originally shipped with the app), otherwise it will not be able to find out which version of the software to roll back to. We achieve this by automatically reloading the original JavaScript bundle that came packaged with the application, and then loading one of two pushed bundles: the latest safe bundle or the most recent bundle. If the most recent bundle can be loaded, it graduates to being the safe bundle. In the event that no safe bundle exists, the original one remains in use with no updates.

This method of updating Restaurant Dashboard has significantly less friction than a regular mobile app update because new builds can be released as needed, cutting down the time to ship a new feature from a matter of weeks to days. Updates are downloaded in the background and loaded once complete, avoiding user interaction. This lack of immediate user interaction enables updates to be propagated faster and that a majority of devices can be kept on the most recent build. The same mechanism also allows us to quickly roll back bad builds, minimising the disruption to restaurant partners.

While pushing updates in this manner has not completely replaced normal app releases (which are still occasionally needed for changes to the iOS or Android native code), it has reduced their frequency. As the native layer matures with the project, we expect this trend to continue.

## Testing and Type Checking

Within Uber Engineering, teams move fast and web projects tend to ship as changes are pushed to the repository rather than waiting for a build train. This stands in stark contrast to the multi-week release processes typically associated with mobile applications. When we contemplated shifting to a native application during the development of Restaurant Dashboard, we were concerned that the stability of the application might suffer due to this tight turnaround; after all, if you crash in the React Native interpreter, you crash in real life. Even with bundle pushes providing a way to reduce this risk, crashing is far from ideal.

Unit testing and shallow rendering in particular have been around for quite some time, but recently there has been a growing movement in the JavaScript community to incorporate static type checking through either Flow or TypeScript.

When updating the app this time around, we decided to type check with Flow, a decision that gave us additional confidence in the correctness of our business logic. Indeed, it has proven to be an invaluable tool for testing code and catching errors before they reach production.

A simple example of Flow’s power lies in type checking reducer functions. As detailed below, a reducer takes the current state and an action as input, and in turn, it is expected to return a new state as output:

```javascript
type Action = {
  payload: Object,
  type: 'NOTIFICATION_DISPLAY' | 'NOTIFICATION_CLOSE',
}

type Notification = {
  autoClose: boolean,
  id: string,
  type: 'error' | 'success',
}

type State = {
  messages: Array<Notification>,
}

// noop notifications reducer
export default (state: State = initialState, action: Action): State => state;
```

## Handling Side Effects

Using Flow to type check allows us to verify that our state maintains its correct shape after this process, and it is a credit to the Flow community that new releases have continued to find possible sources of bugs in our application. Furthermore, the minimal overhead associated with optional typing means it does not get in the way of rapid iteration and development.

Restaurant Dashboard uses Redux for managing the flow of data. Redux provides us with a simple, predictable way to model application state by following a few key principles:

- All state is in the store, which is a single immutable object
- Views take the store as input and render React Native components
- The View can dispatch actions, which are requests to modify the store
- Reducers take the action and current state as input, returning a new store

It is often necessary to alter the store in response to asynchronous actions, such as network requests. Redux does not prescribe a way of doing this, but a common approach is to use Thunks, a middleware for Redux that allows actions to be functions that return a promise and dispatch additional actions along the way.

![In Restaurant Dashboard, data flows through a Redux application.](/assets/images/2017-03-28/figure7.png)

Our initial approach was to use Thunks, but we quickly ran into problems as our application logic (and side effects) became more complicated. Specifically, we encountered two side effect patterns that did not naturally fit into the Thunk model:

- Periodic updates to application state
- Coordination between side effects

Sagas, an alternative side effect model for Redux apps, leverage ES6 (ECMAScript 6) generator functions to provide a less complicated option. Rather than extending the concept of an action, they are modelled as a separate thread which can access the store, listen to Redux actions, and dispatch new ones. In an effort to avoid Thunk-related problems, UberEATS.com recently migrated entirely to Sagas, giving us confidence that they could scale and were mature enough for our needs. (No endless saga here!)

One area where Sagas really shine is in the management of periodic changes in application state, such as retrieving a new list of active orders. This is achievable using Thunks, but is far from elegant. (Who would have thunk? Not us!) For example, the component could periodically dispatch an action to fetch orders; alternatively, the Thunk could call itself recursively. Aside from the implementation issues, however, neither having a component with timer logic—nor an independent Thunk that keeps triggering itself—fits neatly into the Redux model.

Sagas provide a clean way of solving this problem, as they enable us to create a long-living task that periodically fetches new orders and dispatches an action to update the store.

A related problem to having long-running tasks is maintaining communication between them, shown below:

```javascript
function* repeatFetchOrders(): Generator<EffectType, void, mixed> {
  while (true) {
    // Fetch orders from our API
    try {
      const orders = yield call(fetchOrders)
      yield put(fetchOrdersSuccess(orders))
    catch (err) {
      yield put(fetchOrdersFailure(err))
    }

    // Wait before making another call
    yield call(delay, FETCH_INTERVAL);
  }
}
```

Building on the fetch orders example above, orders should only be retrieved and the store should only be updated when a valid user session exists. Failure to enforce this rule can lead to non-obvious errors such as a race condition between the restaurant logging out and its orders being updated. This in turn could reveal edge cases triggering crashes or strange cues from the UI since the code for incoming orders could very reasonably make the assumption that a non-existent restaurant exists.

Protecting against such issues is relatively simple, but identifying potential race conditions and adding the necessary checks is time-consuming and error-prone. More importantly, our order code should not be concerned with the state of the user session, as they are two separate concerns.

Sagas provide a simple way to listen for session-related actions and start or stop the background task for fetching orders. For example, when we see a login event we should fork off a task to periodically fetch orders and cancel the task if a logout is seen. This can be concisely expressed as a Saga, below:

```javascript
function* loginSaga(): Generator<EffectType, void, mixed> {
  // Loop to capture behavior between sessions
  while (true) {
    // Gate until login has been completed
    yield take('LOGIN_SUCCESS');
    // Start the fetch orders task
    const backgroundTask = yield fork(repeatFetchOrders);
    // Gate until the user logs out
    yield take('LOGOUT_SUCCESS');
    // Cancel the repeater
    yield cancel(backgroundTask);
  }
}
```

The forked task is another generator, which will continue to run until it—or its parent—is terminated.

In fact, it turns out that this pattern of gating tasks on specific actions is fairly common. Much like component decorators, we can pull this logic into a higher order generator function, as shown below:

```javascript
function* takeWhile(
  startPattern: string | Array<string>,
  endPattern: string | Array<string>,
  saga: Function,
  ...args: Array<mixed>
): Generator<EffectType, void, Object> {
  while (true) {
    const action = yield take(startPattern);
    yield race({
      end: take(endPattern),
      result: call(saga, action, ...args),
    });
  }
}
```

The nature of Sagas also simplifies the process of testing. With Sagas, unit testing a given piece of functionality is as simple as calling the relevant Saga and performing a deep comparison on the result.

This approach of having many small services communicating with each other through message passing will be familiar to many backend engineers, but we generate and consume Redux actions instead of Kafka events. From our view on the developer side, it has been fascinating to watch these patterns applied to client code.

## Reflecting on the UberEATS Journey

It is nearly impossible to summarise in a single article the entire experience of deploying an application, particularly one that so significantly affected the way restaurants interact with the UberEATS application. If anything, we hope that this piece has provided some additional insight into our team’s thought process behind choosing React Native for UberEATS, as well as some of the steps we took to ensure a stable and robust user experience for our restaurant partners.

While React Native still only constitutes a small portion of the UberEATS engineering ecosystem, our experience using it to rebuild Restaurant Dashboard has been very positive. Since its implementation last year, the revamped Restaurant Dashboard has become a standard tool for nearly every restaurant on UberEATS. At this rate, we are optimistic about the framework’s capacity to continue meeting our needs as we scale and expand our marketplace of users.

{% include code_highlighting %}
