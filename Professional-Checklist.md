# Professional Front-End Checklist

Use this checklist during code reviews and for the capstone. A feature is not complete merely because it looks correct on one screen.

The checklist is a review aid, not a form to complete mechanically. Each item represents a question that can reveal a real product or maintenance issue. For example, a page can pass a visual review but still fail when reached directly by URL, when the API returns an empty list, or when a keyboard user tries to submit the form. Review the feature as a user would experience it, then inspect the code and delivery process that make that experience possible.

## Product and Design

Start by checking whether the interface solves a clearly described task. The design should help users identify where they are, what information matters, and which action to take next. Shared tokens and components support consistency, while explicit loading, empty, error, and disabled states make the product understandable when the normal path is interrupted. Responsive checks should use realistic content at several viewport widths rather than relying on a single desktop screenshot.

- [ ] The user problem and acceptance criteria are clear.
- [ ] The information hierarchy makes the primary action easy to find.
- [ ] The design uses shared color, spacing, typography, and component tokens.
- [ ] Empty, loading, error, success, disabled, and focus states have been designed.
- [ ] Layouts have been checked on narrow, medium, and wide screens.

## React and TypeScript

Next, review the data flow. A component should receive a clear contract, state should live close to the components that need it, and duplicated derived state should be avoided. Effects should have a specific synchronization responsibility and a cleanup strategy where necessary. TypeScript should make the application's data model clearer, while runtime validation protects the boundary where data enters from APIs, storage, or URLs.

- [ ] Components have one clear responsibility and sensible public props.
- [ ] State is owned by the closest common component that needs it.
- [ ] Derived values are calculated rather than duplicated in state.
- [ ] Effects synchronize with external systems and include correct cleanup.
- [ ] Lists use stable identifiers as keys.
- [ ] TypeScript types describe real data and avoid unnecessary `any` assertions.
- [ ] API data is treated as untrusted until validated.
- [ ] Shared state uses an appropriate solution, not a global store by default.

## HTML, CSS, and Accessibility

Then operate the feature without a mouse and inspect its semantic structure. Native elements usually provide more reliable keyboard and assistive-technology behavior than custom controls. Visible focus, labels, contrast, meaningful alternative text, and reduced-motion support are not optional decorations; they are part of whether people can use the feature. Check the rendered layout at different widths and with zoomed content.

- [ ] Semantic HTML is used before adding ARIA attributes.
- [ ] Every form control has an accessible label.
- [ ] All interactions work with a keyboard.
- [ ] Focus is visible and follows a logical order.
- [ ] Text and controls have sufficient contrast.
- [ ] Images have appropriate alternative text.
- [ ] Motion respects `prefers-reduced-motion` where appropriate.
- [ ] No horizontal overflow occurs at supported viewport sizes.

## Quality and Delivery

Finally, verify that the feature can survive change and reach users safely. Tests should protect important behavior, the type check and production build should pass, and the console should be free of avoidable errors and warnings. Public client environment variables must not contain secrets, dependencies should be intentional, and route fallback should be configured for the deployed hosting environment. A clear README and meaningful Git history help the next developer understand how to run and maintain the project.

- [ ] Important user flows have automated tests.
- [ ] The app has been checked in browser developer tools.
- [ ] The production build and type check pass.
- [ ] Console warnings and runtime errors are resolved.
- [ ] Secrets are not exposed through `VITE_` environment variables.
- [ ] Dependencies and lockfiles are managed consistently.
- [ ] SPA hosting is configured to serve the application entry point for client-side routes.
- [ ] A README explains setup, scripts, environment variables, and deployment.
