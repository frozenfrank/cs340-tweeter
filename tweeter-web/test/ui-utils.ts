import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Cause the FontAwesome icons to render properly during testing
library.add(fab);

// Convenience exports for common items
// NOTE: The tests will run just fine without exporting `React`,
// but we do need the side-effects it produces.
// Users of this script can silence errors by importing React, even though it would work without it.
export { React, render, screen, userEvent };
