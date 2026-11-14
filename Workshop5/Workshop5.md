# Workshop 5: Design Philosophy, Design Language, and Design Systems

Up to this point, the course has focused on making an application work. We have learned how to build components, manage state, handle user interactions, communicate with APIs, and organize applications into multiple pages.

However, a technically correct application is not necessarily a good application. Users may struggle to find important information, misunderstand the available controls, or receive no feedback after performing an action. These problems are not caused by programming errors; they are design problems.

This introduces another important part of front-end development: understanding how an application should look, behave, and communicate with its users.

Imagine building a management application for a small store. Employees may need to check product quantities, locate products, register sales, and manage customer information. Although we can implement all these features using React, the application will not be useful if employees struggle to understand the interface or complete their daily tasks.

Therefore, before deciding which components to build, we need to understand the people who will use the application and the problems they are trying to solve.

In this workshop, we will explore a connected design process. We will begin by understanding the relationship between user experience and interface design, then establish a design philosophy that guides our decisions. From there, we will develop a consistent design language, store repeated decisions as design tokens, and use those decisions to create reusable components and page templates.

Finally, we will translate these ideas into React components and responsive CSS, while considering accessibility and usability throughout the process.

## Objectives

By the end of this workshop, you should be able to:

- Understand the difference between UX, UI, visual design, and front-end implementation.
- Define a design philosophy based on user needs and product goals.
- Create a design language using reusable visual and interaction rules.
- Understand design tokens, component libraries, and design systems.
- Use page templates to create consistent application layouts.
- Translate a design brief into React components and responsive CSS.
- Apply accessibility and responsive design from the beginning, rather than treating them as final adjustments.

## Why Front-End Developers Need Design Skills

Front-end development is not simply the process of converting a picture into HTML and CSS.

A developer must understand what the user is trying to accomplish, organize information, select suitable interface patterns, implement interactions, and make sure the result works across different devices and input methods.

Consider two applications that perform exactly the same operations. Both allow employees to manage products, register sales, and view stock information. However, one application presents important information clearly, uses familiar controls, and provides feedback after every action. The other uses inconsistent layouts, unclear buttons, and confusing navigation.

Although both applications may be technically correct, they do not provide the same experience.

A good interface is therefore not necessarily the one with the most animations, colors, or visual effects. It is the one that helps the intended user complete the intended task clearly, efficiently, and reliably.

### UX, UI, Visual Design, and Front-End Development

Before going further, we need to understand four related terms that are often used together but describe different aspects of product development.

**User Experience (UX)** refers to the overall experience of using a product. It includes the user's goals, workflows, information structure, feedback, and obstacles encountered while interacting with the application.

**User Interface (UI)** refers to the interactive surface through which the user works. It includes navigation, buttons, forms, content areas, and other interface elements.

**Visual Design** focuses on how the interface looks and communicates information. It uses typography, color, spacing, shape, imagery, contrast, and visual hierarchy to create a coherent appearance.

**Front-End Development** is the process of implementing the interface using browser technologies. The developer translates the design into functional, responsive, accessible, and maintainable code.

These areas are closely connected. UX helps us understand what the user needs, UI defines how the user interacts with the product, visual design determines how information and controls are presented, and front-end development brings everything together in a working application.

A front-end developer should therefore be able to read a design, identify ambiguous behavior, recognize missing interface states, and implement the intended experience rather than simply reproduce a screenshot.

Imagine a store employee who opens a dashboard at the beginning of a shift. They may need to identify products with low stock, locate a customer, or record a sale. A screenshot can show the arrangement of cards and buttons, but it cannot always explain what should happen when a list is empty, a save operation fails, the user zooms into the page, or the employee navigates using only a keyboard.

Understanding design means thinking about the complete interaction, not just the default appearance of the interface.

## Design Philosophy

Before deciding how an application should look, we need to establish the principles that will guide our decisions.

This is called a **design philosophy**.

A design philosophy is a set of principles that explains what the interface should prioritize and why. It acts as a decision-making filter throughout the product's development.

For example, a practical design philosophy for a business management application might be:

> Make important information easy to find, keep repeated actions consistent, provide immediate feedback, and avoid visual complexity that does not help the user complete a task.

This philosophy tells us what matters when designing the application. When two possible designs are available, the team can evaluate which one better supports these principles.

Imagine that we are designing a dashboard for managing store inventory. One possible design displays every product using the same visual treatment. Another highlights products with low stock using a restrained warning indicator and provides a filter to display only affected products.

The second design better supports the goal of making urgent information visible without making every element compete for attention.

Notice that the philosophy does not prescribe exact colors, fonts, or component dimensions. Instead, it guides the reasoning that leads to those decisions.

We can translate this philosophy into several practical design principles.

### User-Centered Design

The first principle is to start with the people who will use the application and the tasks they need to complete.

Instead of immediately deciding that a dashboard needs a red card, we should first understand why the information matters.

For example, the statement:

"The employee wants to know which products need reordering."

is more useful than:

"The page needs a red card."

The first statement describes a user goal, while the second jumps directly to a visual solution without understanding the problem.

Once we understand the goal, we can investigate the current workflow, identify the information needed, and determine where mistakes are likely to occur.

This does not require a large research department. Even a short conversation with the intended users can reveal assumptions that would otherwise lead to expensive design changes.

When designing a product, consider the following questions:

- Who will use the application?
- What are they trying to accomplish?
- What information do they need at each step?
- What mistakes are likely, and how can the interface prevent or recover from them?
- What devices, screen sizes, abilities, and environments must be supported?

Answering these questions gives us a better understanding of the problem before we begin designing the solution.

### Visual Hierarchy

Once we understand what information the user needs, we must decide how to organize and present it.

Not every element should compete for attention. If every card uses the same size, color, border, and heading weight, the user will struggle to understand where to look first.

Visual hierarchy solves this problem by using size, position, spacing, contrast, and grouping to communicate the relative importance of information.

A well-organized screen usually has a clear reading order. The page title establishes the current context, the primary action indicates what the user can do, and the main content presents the information needed to complete the task. Supporting information and secondary actions should remain accessible without distracting from the primary purpose.

A practical way to test visual hierarchy is to look at a screen for a few seconds and ask what a first-time user would notice first, second, and third.

For example, a store inventory dashboard might prioritize:

1. The page title and current context.
2. Important stock information and primary actions.
3. Supporting information and secondary actions.
4. Optional details and less frequently used actions.

Spacing and alignment help group related elements, while contrast helps important information stand apart.

The goal is to make the interface easier to scan and understand, rather than making every component visually impressive.

### Consistency

Consistency is another important principle because users should not need to relearn the interface every time they move to another page.

Imagine that the primary action is displayed as a blue button on the dashboard but appears as a gray text link on the product page. Similarly, suppose validation errors appear below inputs on one form but inside a notification at the top of another.

These differences may seem small, but they introduce unnecessary uncertainty.

A consistent interface uses similar visual and interaction patterns for similar tasks. Buttons that perform comparable actions should look and behave consistently, form errors should follow a predictable pattern, and navigation should maintain the same structure across pages.

Consistency applies to button hierarchy, form behavior, navigation, wording, spacing, icons, and feedback messages.

It does not mean making every page identical. Each page can have a different purpose while still following the same design rules.

The benefit is that users can transfer what they learned on one screen to another, reducing the mental effort required to operate the application.

### Feedback and Affordance

When a user interacts with an application, the interface should communicate what happened.

Imagine that an employee clicks a button to save a new product. If nothing changes and no message appears, the employee may wonder whether the operation succeeded. They might click again, leave the page, or assume that the application has lost the information.

Feedback closes this interaction loop by communicating the result of an action.

For example, a button may display a loading indicator while an operation is processing, followed by a success message when the operation finishes. If the operation fails, the interface should explain what happened and, where possible, how the user can recover.

Interactive controls should also communicate how they are expected to be used.

This is related to a concept called **affordance**.

An affordance is a visual or behavioral cue that helps someone understand how to interact with an element. A button should look and behave like a button, a link should indicate navigation, and a checkbox should communicate a selectable state.

For example, buttons should provide appropriate hover, focus, active, disabled, and sometimes loading states. A destructive action should be visually distinguishable from a normal action and may require confirmation or an undo option.

Clear labels and familiar native controls are often more effective than unfamiliar decorative elements.

### Simplicity and Progressive Disclosure

A simple interface is not necessarily an interface with very few features. It is an interface that presents information and functionality at the appropriate time.

Consider a product management page containing dozens of filters, settings, and actions. Displaying all of them immediately may make the page overwhelming, especially for employees who only need to search for a product or check its quantity.

Instead, we can show the most frequently used controls first and make advanced filters available when needed.

This approach is called **progressive disclosure**.

The idea is to present what users need for their current task without hiding essential information. Advanced settings, detailed filters, and secondary actions can be revealed when they become relevant.

For example, a product form might display the name, price, and quantity fields first, while optional settings appear in a separate expandable section.

The user can complete the common operation without needing to understand every available option.

### Accessibility and Inclusion

Accessibility should influence design decisions from the beginning rather than being treated as a final adjustment.

Imagine that a product status is indicated using only a red or green dot. A person who cannot distinguish those colors may not understand the meaning.

We can solve this by adding descriptive text or another visual indicator instead of relying on color alone.

Similarly, if an interaction works only when the mouse hovers over an element, keyboard and touch users may not be able to access it.

Small text, weak contrast, unclear labels, and invisible focus indicators can also make an application difficult to use.

Accessible design improves the clarity and reliability of the interface for a wide range of users.

When designing an application, consider keyboard navigation, screen readers, browser zoom, different contrast needs, reduced motion, and different interaction methods.

Use semantic HTML and provide controls with clear accessible names.

Accessibility is not an optional improvement. It is part of product quality.

### Responsive Behavior

Another important principle is to design interfaces that adapt to different screen sizes.

Responsive design is not simply shrinking a desktop layout until it fits on a mobile screen. The structure and presentation of information may need to change depending on the available space.

For example, a wide data table might become a horizontally scrollable region, a carefully selected set of stacked fields, or a compact list with a separate detail view.

A sidebar might become a menu or bottom navigation, depending on the application's purpose.

We should identify the content that must remain accessible on a narrow screen and decide how the layout should reflow, reorder, wrap, or move into another navigation pattern.

Breakpoints should be chosen when the layout no longer serves the content, not simply because a particular device brand uses a certain screen width.

Always test actual content at different widths. Long product names, translated labels, and validation messages can reveal problems that short placeholder text might hide.

## From Design Philosophy to Design Language

We now have a set of principles that explain how the application should behave and what it should prioritize.

However, principles alone are not enough to implement several pages consistently.

Developers and designers also need a shared vocabulary that translates abstract ideas into concrete design decisions.

For example, a product might aim to feel calm, clear, trustworthy, or professional. These qualities need to be reflected in recurring choices about color, typography, spacing, icons, component behavior, and interaction feedback.

This shared vocabulary is called a **design language**.

A design language is the collection of visual and interaction rules that gives a product a recognizable and consistent identity.

It ensures that separate pages feel as though they belong to the same application, even when they serve different purposes.

A design language typically describes:

- Color roles and palettes.
- Typography families, sizes, weights, and line heights.
- Spacing scales and layout grids.
- Border radii, borders, shadows, and elevation.
- Icon styles and illustration rules.
- Component appearance and behavior.
- Interaction states, motion, and feedback.
- Writing style and terminology used by the interface.

A design language is therefore more than a collection of colors. It connects appearance, behavior, and product identity.

It should also define what not to do.

For example, danger colors might be reserved for destructive actions or critical states. Primary buttons should not be used for every secondary action, and animations should clarify changes in the interface rather than simply decorate the page.

These constraints prevent individual design decisions from drifting apart as the application grows.

### Define Semantic Color Roles

Instead of choosing an arbitrary color for every component, we should define a set of color roles.

For example, an application might use:

- Page background.
- Surface background.
- Primary text.
- Muted text.
- Border.
- Primary action.
- Danger.
- Warning.
- Success.

The role matters more than the raw color value.

A component should request `--color-text-muted` rather than deciding independently that it needs a particular shade of gray.

This makes it easier to maintain a consistent appearance and adapt the design when the product's theme changes.

### Define Typography

Typography is another important part of the design language because it determines how information is presented and how easily users can read it.

We should establish a limited set of typography styles for page titles, section headings, body text, labels, helper text, and small metadata.

Each style should have a defined font size, weight, and line height.

For example, a page title might use a larger font size and stronger weight, while supporting information uses a smaller and more subtle style.

Using a consistent typography scale prevents every component from introducing its own unrelated text sizes.

### Define Spacing and Shape

Spacing plays an important role in visual hierarchy because it determines how elements relate to each other.

Imagine a form where some inputs are separated by 8 pixels, others by 13 pixels, and others by 21 pixels without any clear reason.

The layout may still work, but it will be difficult to maintain a consistent appearance.

Instead, we can define a spacing scale and reuse its values for gaps, padding, and section separation.

The same principle applies to shapes. We should define a small set of border radii, border styles, and shadows rather than styling every card and button independently.

This gives the application a more unified appearance.

## Design Tokens

Once the design language has been established, we need a way to store its repeated values so that they can be reused throughout the application.

This is the purpose of **design tokens**.

Design tokens are named values that represent design decisions. Instead of repeating raw colors, spacing measurements, or font sizes throughout our CSS, we assign meaningful names to them.

This makes global changes easier because we can update a token in one place and allow the components using it to inherit the new value.

A simple token layer can be implemented using CSS custom properties.

For example:

```css
:root {
  /* Color roles */
  --color-page: #f6f7fb;
  --color-surface: #ffffff;
  --color-text: #182230;
  --color-text-muted: #667085;
  --color-border: #d0d5dd;
  --color-primary: #3457d5;
  --color-primary-hover: #2846b7;
  --color-danger: #b42318;
  --color-success: #067647;

  /* Typography */
  --font-body: Inter, system-ui, sans-serif;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Shape and depth */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --shadow-card: 0 0.25rem 1rem rgb(16 24 40 / 8%);
}

[data-theme='dark'] {
  --color-page: #101828;
  --color-surface: #1d2939;
  --color-text: #f2f4f7;
  --color-text-muted: #c0c8d4;
  --color-border: #475467;
}

body {
  margin: 0;
  background: var(--color-page);
  color: var(--color-text);
  font-family: var(--font-body);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
}
```

These values are examples rather than a universal palette. The actual colors, typography, and spacing should be selected and tested according to the product's identity, content, and accessibility requirements.

The important detail is how we use the tokens.

For example, the `.card` class does not define its own background color or padding using arbitrary values. Instead, it references the design tokens that represent those decisions.

If we later decide to change the card spacing or surface color, we can update the token rather than searching through every component.

### Primitive and Semantic Tokens

In a larger design system, tokens may be organized into different levels.

**Primitive tokens** represent raw values, such as a particular shade of blue or a spacing measurement.

**Semantic tokens** assign meaning to those values, such as primary action, subtle border, or page background.

**Component tokens** represent values specific to a particular component, such as button height or card padding.

This separation allows the product's theme to change without rewriting component styles.

For example, a primitive token might represent a specific blue from the brand palette. A semantic token such as `--color-action-primary` assigns that color a role.

The button can then use the semantic token without knowing the original color value.

In dark mode, the semantic token can point to a different primitive value while the button component remains unchanged.

This illustrates an important distinction: we should name values according to what they represent in the interface, not only according to their appearance.

Tokens also improve communication between design and development. A designer can document a spacing scale or surface role, and the developer can map it to CSS custom properties.

The CSS shown here is a practical starting point. Larger products may store tokens in a design tool or shared package and generate platform-specific outputs.

Regardless of the implementation, the principle remains the same: repeated design decisions should be named, documented, and reused.

## From Design Language to a Design System

A design language gives us shared visual and interaction rules, while design tokens allow us to store those rules as reusable values.

However, a complete application needs more than colors, typography, and spacing. We also need reusable components, page patterns, documentation, and guidelines that explain how everything should work together.

This broader collection is called a **design system**.

A design system is the organized collection of principles, design tokens, components, patterns, and documentation used to build consistent products.

It connects the decisions made during design to the actual components developers use when building the application.

A design system may include:

- Design philosophy and product principles.
- Design language and design tokens.
- A component library with usage rules.
- Page patterns and templates.
- Accessibility and content guidelines.
- Documentation, examples, and versioning.

A design system is therefore much more than a folder containing buttons and cards. It explains when and how to use each component, which variants are available, and how those components should behave.

For example, a component library may contain a `StatusBadge` component. However, without usage guidance, one developer might use it for stock status, another might use it for navigation labels, and someone else might introduce a completely different badge for the same purpose.

Documentation establishes the intended meaning of each variant and explains when the component should be used.

The system therefore contains both the implementation and the shared decisions behind it.

### Build Reusable UI Components

Let's create a reusable button component using React and TypeScript.

A button should support a small number of intentional variants rather than allowing every part of the application to invent its own appearance.

For example:

```tsx
import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}
```

Let's understand the structure.

The `ButtonProps` type extends `ButtonHTMLAttributes<HTMLButtonElement>`. This means our component supports the standard attributes and behaviors of an HTML button, such as `disabled`, `aria-label`, and `onClick`.

We then introduce a `variant` prop that allows the component to use one of three predefined styles.

The default variant is `primary`, so we do not need to specify it every time we use the component.

We also set the default button type to `button`. This is important because an HTML button placed inside a form behaves as a submit button by default. By explicitly setting the default to `button`, we avoid accidentally submitting forms when the component is used for ordinary actions.

When we actually need a submit button, we can pass `type="submit"`.

We also preserve the standard `className` prop so that a component can receive additional styling when necessary.

The important idea is not to make a component accept every possible customization. Its API should provide enough flexibility for real use while remaining predictable and consistent.

A reusable button component should make it easier to maintain the product's button styles and behavior, not create another source of visual inconsistency.

## What Is a Design Template?

Components solve local interface problems, but we also need a way to organize complete pages.

For example, a dashboard, a listing page, and a data-entry form have different information patterns. However, repeated pages of the same type often share a recognizable structure.

A dashboard may contain a page heading, summary cards, charts, and recent activity. A listing page may contain search, filters, a result count, and a table. A form page may contain grouped inputs, helper text, validation messages, and submission actions.

Instead of starting every page from an empty layout, we can define reusable page structures.

These structures are called **design templates**.

A design template is a reusable page-level structure that describes where the main regions of a page belong and how they relate.

It is not the same as a design language or a component library.

Common examples include:

**Dashboard Template:** Usually contains a top bar, sidebar, page heading, filters, summary cards, charts, and an activity list.

**Listing Template:** Usually contains a page title, search and filters, a result count, a list or grid, pagination, and an empty state.

**Detail Template:** Usually contains back navigation, primary content, metadata, related information, and main actions.

**Form Template:** Usually contains a page heading, grouped fields, helper text, validation messages, and submit or cancel actions.

**Landing Page Template:** Usually contains a hero section, value proposition, feature sections, supporting evidence, and a call to action.

A template provides a starting structure, but it should adapt to its content and user task rather than forcing every page into exactly the same shape.

For example, if a particular listing has no filters, we should not display an empty filter area just to preserve the layout. Similarly, if a detail page contains an important warning, the template should allow that information to receive the necessary emphasis.

The reusable structure provides consistency, while the content and user task determine how it is filled.

### Template vs. Component vs. Design System

These concepts are related, but each has a different responsibility.

| Concept | Main question | Example |
|---|---|---|
| Design philosophy | What principles guide our decisions? | Clarity before decoration. |
| Design language | What shared visual and interaction vocabulary do we use? | Color roles, typography, spacing, button states. |
| Design tokens | How are those decisions stored as reusable values? | `--color-primary`, `--space-4`. |
| Component | What reusable UI building block do we implement? | `Button`, `TextField`, `Modal`, `Card`. |
| Page template | How are common page regions organized? | Dashboard layout with sidebar and content area. |
| Design system | How do all these rules, components, and patterns work together? | Documented tokens, components, templates, and usage rules. |

Understanding these distinctions helps us decide which parts of the interface should be reused and at what level.

## Translate a Design into React

We now have the main concepts needed to create a consistent interface. The next step is translating those decisions into an actual React application.

This is where the design process becomes a front-end implementation plan.

It is tempting to open the editor and immediately create a `Card` component because we see a rectangle in a design.

However, we should first understand the page's purpose, identify its content regions, and recognize which patterns are repeated.

Then we can decide which parts should become components, which styles belong in design tokens, and which structural decisions belong in a page template.

This makes the React component tree reflect the application's meaning rather than simply reproducing every decorative layer of a design file.

A practical implementation process looks like this:

**1. Understand the task**

Identify the intended user, their goal, and what a successful interaction looks like.

**2. Map the content**

Group related information and identify the primary action.

**3. Sketch the structure**

Create a rough wireframe before deciding on detailed visual styles.

**4. Define the visual language**

Choose tokens for color, typography, spacing, shape, and interaction states.

**5. Select a page template**

Choose or adapt a structure that supports the user's task.

**6. Identify components**

Separate repeated patterns into components with clear responsibilities and well-defined props.

**7. Implement responsive behavior**

Decide how the different sections should adapt to available screen sizes.

**8. Check accessibility**

Test keyboard operation, labels, focus, contrast, and screen-reader meaning.

**9. Validate the result**

Observe where users hesitate, misunderstand the interface, or struggle to complete their tasks. Use those observations to improve the design.

### Organizing a React Dashboard

Let's imagine that we are implementing a dashboard for our management application.

Its component structure might look like this:

```text
App
└── DashboardLayout
    ├── Sidebar
    ├── Topbar
    └── DashboardPage
        ├── PageHeader
        ├── SummaryGrid
        │   └── SummaryCard
        ├── ActivityPanel
        └── DataTable
```

Each component represents a meaningful part of the interface.

`DashboardLayout` provides the overall page structure. `Sidebar` and `Topbar` handle navigation and common controls, while `DashboardPage` combines the content specific to the dashboard.

Inside it, `SummaryGrid` organizes the summary cards, and `ActivityPanel` and `DataTable` display additional information.

The component tree should reflect meaningful regions and responsibilities. It does not need to match every single visual wrapper in the design file.

A helpful test is to ask whether a component has a stable role and a useful interface.

For example, `SummaryCard` may be reusable because several pages display a metric with a label, value, and optional trend.

A wrapper that exists only to add one margin value may be better represented by CSS unless it has a meaningful layout responsibility.

Good component boundaries make changes safer. When the button style changes, we can update it in one place. When the information hierarchy of a dashboard changes, we can adjust the page composition without rewriting the entire design system.

## Responsive Layout Fundamentals

A consistent design system should work across different screen sizes.

However, responsive layout is a content problem before it becomes a CSS syntax problem.

We first need to understand how information should be grouped and displayed when the available width changes.

For example, a dashboard may display four summary cards in one row on a wide screen. On a smaller screen, those cards may need to appear in two columns or become vertically stacked.

Similarly, a toolbar might display its controls horizontally on desktop but allow them to wrap or stack on smaller screens.

CSS provides several layout tools that help us handle these situations.

**Flexbox** is useful when arranging items primarily in one direction, such as a toolbar, navigation bar, or button group.

**Grid** is useful when creating layouts with rows and columns, such as a dashboard containing multiple summary cards.

**Normal document flow** remains the best default for most text and content sections because the browser already knows how to make content flow as the available space changes.

**Media queries** allow us to change layout behavior when the viewport reaches a certain width.

For example, consider the following responsive grid:

```css
.summary-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 42rem) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 70rem) {
  .summary-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

On narrow screens, the cards appear in a single column. Once enough horizontal space becomes available, the layout changes to two columns, and on wider screens it displays four columns.

This is an example of a mobile-first approach.

We begin with a layout that works on narrow screens and gradually enhance it as more space becomes available.

Avoid fixed widths that introduce unnecessary horizontal scrolling, and always test real content instead of relying only on placeholder text.

Do not assume that a layout is responsive simply because its cards become narrower. The order of information, accessibility of actions, size of touch targets, and readability of tables all affect usability.

Test long product names, large numbers, missing images, and validation messages. These realistic cases reveal problems that short placeholder labels might hide.

## Accessibility in Everyday Components

Accessibility is where visual design, interaction behavior, and semantic HTML come together.

A visible button should actually be a `<button>` so that it can receive keyboard focus and respond to standard activation keys. Navigation should be represented using `<nav>`, and form inputs should have labels that can be understood by assistive technologies.

Semantic HTML gives browsers and assistive tools information that styling alone cannot provide.

Use semantic HTML first. A button should be a `<button>`, navigation should be inside `<nav>`, and the main page content should normally be inside `<main>`.

Use ARIA attributes when native HTML does not adequately express the required role or state.

For forms, each input should have a visible label, and the interface should explain expected formats and constraints. Validation messages should be associated with the relevant controls, while errors should never be communicated using color alone.

Focus should also remain visible and follow a logical order, especially after form submission or validation.

Interactive controls need similar attention. We should ensure that keyboard users can access every action, icon-only buttons have accessible names, and focus indicators are not removed without providing an appropriate replacement.

Another important consideration is reduced motion. Transitions and animations can make an interface feel responsive, but some users prefer to minimize movement.

We can respect this preference using the `prefers-reduced-motion` media query.

For example:

```css
:where(button, a, input, select, textarea):focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

The first rule provides a visible focus indicator when keyboard users navigate through interactive controls.

The second rule reduces animations and transitions for users who have requested reduced motion through their operating system or browser settings.

Accessibility should be tested alongside visual design because it directly affects whether the interface works for different people.

Also test actual interactions rather than only the markup. Can a keyboard user open and close the menu? Does focus move somewhere sensible after a dialog closes? Is an error announced when form submission fails? Do status messages remain understandable without their colors?

These questions turn general accessibility principles into concrete implementation requirements.

## Workshop Challenge: Design a Management Dashboard

Now it is time to apply what we have learned.

Design and implement a responsive dashboard for a small store, learning platform, or service business.

The purpose of this exercise is not simply to create an attractive page. You should apply the complete design process, starting with the user's needs and finishing with reusable React components.

### Part A: Product Thinking

Start by understanding the application and its intended users.

1. Write a short description of the user and their main task.
2. Identify the three most important pieces of information.
3. Identify the primary action and two secondary actions.
4. Write five design principles that should guide the product.

For example, a store employee may need to check product quantities quickly, identify low-stock products, and register sales without navigating through several unrelated pages.

Use these tasks to determine what the dashboard should prioritize.

### Part B: Design Language

Once the main requirements are clear, define the visual rules for the application.

1. Define color roles for page, surface, text, muted text, border, primary action, danger, and success.
2. Define a typography scale and spacing scale.
3. Define button variants, card styles, form field styles, and status indicators.
4. Add focus, hover, disabled, loading, and error states.

Implement these decisions using CSS custom properties so the application can reuse them consistently.

### Part C: Templates and Implementation

Now translate the design into React.

1. Sketch a dashboard template with navigation and a main content area.
2. Build `AppShell`, `Sidebar`, `PageHeader`, `Button`, `Card`, and `StatusBadge` components.
3. Render summary cards from typed data.
4. Make the layout responsive using Grid and Flexbox.
5. Test the interface using only a keyboard.

### Challenge Goal

By completing this exercise, you will practise understanding user requirements, establishing a design philosophy, defining reusable design tokens, creating a consistent component library, organizing pages using templates, and implementing responsive interfaces.

Try to complete the design process yourself before looking for a complete solution.

Focus on explaining why you made each design decision, not simply whether the final page looks attractive.

## Workshop Recap

In this workshop, we moved beyond implementing application functionality and explored how to create interfaces that are consistent, understandable, and accessible.

Let's review the main ideas and how they connect.

### Design Philosophy and User Experience

A design philosophy establishes the principles that guide decisions throughout a product.

UX focuses on the complete experience of using the application, while UI represents the interactive surface through which users perform their tasks. Visual design determines how information and controls are presented, and front-end development implements the resulting interface.

A good design begins with understanding the user's needs rather than choosing colors or animations immediately.

### Design Language and Design Tokens

A design language defines the shared visual and interaction vocabulary of a product.

It establishes rules for color, typography, spacing, shapes, icons, and component behavior.

Design tokens store repeated design decisions as named values, allowing components to reuse them consistently and making global changes easier.

### Components, Templates, and Design Systems

Reusable components provide consistent building blocks such as buttons, cards, forms, and status indicators.

Page templates organize these components into reusable page-level structures.

A design system brings everything together through documented principles, tokens, components, templates, and usage guidelines.

### Implementation and Quality

React components should represent meaningful responsibilities rather than every decorative wrapper in a design.

Responsive layouts should adapt to the content and user task, while accessibility should influence both the visual presentation and interaction behavior from the beginning.

A successful interface is not judged only by its appearance. It must also help users complete their tasks reliably.

### Self-Check

Before moving to the next workshop, make sure you can answer these questions:

1. What is the difference between UX, UI, and visual design?
2. What is a design philosophy, and why do we need one?
3. What is visual hierarchy, and how does it improve an interface?
4. What is the difference between a design language and a design system?
5. What are design tokens, and why are they useful?
6. What is the difference between primitive and semantic tokens?
7. What is the difference between a reusable component and a page template?
8. Why should React components represent meaningful responsibilities?
9. When should we use Flexbox, Grid, and normal document flow?
10. Why should accessibility be considered from the beginning of the design process?

If you can answer these questions and complete the management dashboard challenge, you have understood the main concepts of this workshop.

## How This Leads to Workshop 6

A clear design language and reusable templates give our application a consistent visual foundation. However, they do not guarantee that the product is reliable, secure, fast, or easy for another developer to maintain.

Imagine that we have completed our management application. It contains several pages, reusable components, a consistent design system, and responsive layouts.

The application looks good and its main features work, but we still need to consider what happens when users submit invalid information, when an API request fails, when the application contains a large amount of data, or when it is deployed to a production environment.

We also need to think about how other developers will understand and maintain the code as the project grows.

These concerns introduce another important stage of front-end development: preparing an application for real-world use.

In **Workshop 6**, we will explore professional React development practices, including project organization, form validation, testing, performance optimization, error handling, security considerations, and production deployment.

This will take us from building an application that works and looks good to delivering one that is reliable, maintainable, and ready for real users.
