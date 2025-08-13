# Architecture

This page documents the project's source layout, allowed dependency flow, and architectural patterns.

---

## Overview

The application follows a layered architecture pattern with clear separation of concerns and unidirectional dependency flow.
The architecture is designed to be framework-agnostic at the core, with framework-specific concerns isolated to outer layers.

---

## Dependency Flow

The architecture enforces **unidirectional dependency flow** moving down the stack.
Always respect the dependency flow to avoid circular dependencies.

![Architecture Diagram](./diagrams/.output/architecture-layers.svg)

[Source](./diagrams/architecture-layers.d2)

---

## Layers

### `src/lib/` - Core Business Logic

Pure, framework-agnostic domain logic and utilities.
No framework-specific code or side effects.

#### `src/lib/domain/<module>`

Contains domain modules with pure business logic.
These rules and definitions establish the application's unique characteristics.
Their operation is entirely independent of data persistence mechanisms or presentation concerns.
This layer functions as the core intelligence of the application.
It encapsulates the 'what' of the business domain, distinct from the 'how' of its implementation.

A module may contain the structural elements listed below, or it may be organized into submodules that implement specific aspects of the business logic for that domain area.

##### `src/lib/domain/<module>/types`

The foundational data types central to an application's domain are defined here.
These are considered conceptual blueprints for data models.
For instance, the structure for a `Game` or a `GameId`.
Collectively, these form the language of the business domain.

##### `src/lib/domain/<module>/constants`

Unchanging values specific to business rules are stored here.
They are documented to clarify their meaning.

##### `src/lib/domain/<module>/mappers`

Data entering the application, potentially from a database or external service, often requires transformation to align with the structure expected by the core business logic.
Mappers function as translators, converting data from an external format, such as `DBPuzzle`, into the internal structures of the domain, such as `Puzzle`.
This transformation ensures data consistency for processing by the business logic.
An example includes the mapping of a `DBGame` record to a `Game` type.

##### `src/lib/domain/<module>/{decoder, encoder}`

This layer manages the transformation of data for external transmission or internal processing after retrieval.
Encoding involves converting structured domain data, such as a `Puzzle` object, into a serialized format like `PuzzleEncoded`.
Decoding performs the reverse operation, converting serialized data back into structured domain objects.

##### `src/lib/domain/<module>/validators`

Functions are provided to verify data consistency with established business rules.
For instance, validation ensures that a `GridCellFilled` value adheres to allowed ranges, or that a `Puzzle` structure maintains integrity.
Validators ensure that only valid and meaningful data is permitted to enter or be processed by the core business logic.

#### `src/lib/infrastructure/`

Adapters bridge the gap between domain logic and external systems.
The persistence layer contains database adapters and storage configurations.

#### `src/lib/services/`

Service classes orchestrate interactions between domain logic and infrastructure components.
The `PuzzleService` coordinates puzzle generation through web workers.
Client services manage browser-specific business logic coordination.
Worker-based services handle computationally intensive operations like puzzle creation.

#### `src/lib/application/`

The application layer coordinates high-level business operations and policies.
Command handlers process business operations that modify system state.
Query handlers retrieve and transform data for presentation layers.
Policy modules enforce business rules and authorization constraints across application boundaries.

---

## Presentation Layers

### `src/ui/` - Design System

Reusable, presentational UI components with no business logic.

#### `src/ui/tokens/`

Design tokens for consistent styling:

- **Primitives** - Base design tokens (colors, spacing, typography)
- **Functional** - Semantic design tokens built on primitives

#### `src/ui/primitives/`

Primitive UI elements that consume design tokens:

- Low-level components (Button, Input, Card, etc.)
- Direct consumers of design tokens
- No business logic

#### `src/ui/components/`

Composed UI components built from primitives:

- Higher-level reusable components
- Composition of primitive elements
- Still presentational, no business logic

### `src/features/` - Feature Modules

Feature slices containing smart components and business logic:

- Resources - Data fetching and state management
- Actions - User interactions and commands
- Smart Components - Feature-specific components with business logic

### `src/routes/` - Application Pages

Route-level screens that compose features and UI:

- Pages - Top-level route components
- Compose features and UI components
- Handle routing-specific concerns
- Defines layout concerns

---

## Application Shell

### `src/context/`

Solid context and hooks with providers.

### `src/app*.tsx`, `src/entry-*`

Application shell, providers, and runtime bootstrapping.

---

## Handling Interdependent Types

Place shared types in a common domain location:

```
lib/domain/
├── shared/
│   ├── types.ts
│   ├── events.ts
│   └── contracts.ts
├── game/
└── user/
```

Use TypeScript's type-only imports to avoid runtime circular dependencies.

```typescript
import type { GameId } from "#src/lib/domain/game";
import type { UserPreferences } from "#src/lib/domain/user";
```
