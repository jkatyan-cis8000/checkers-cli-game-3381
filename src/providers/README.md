# Providers Module

This module handles dependency injection and cross-cutting concerns.

## Purpose

Provide singleton instances of services and configure dependencies between layers.

## Responsibilities

### Dependency Provision
- Create and configure game repo instance
- Create and configure game service instance
- Create and configure UI instance

### Cross-Cutting Concerns
- Logging (if needed)
- Error handling utilities
- Shared configuration

## Pattern

```typescript
import { FileRepo } from '../repo'
import { createGameService } from '../service'
import { createUi } from '../ui'

export const gameRepo = new FileRepo()
export const gameService = createGameService()
export const ui = createUi()
```

## Notes

- This module depends on all other modules
- Should contain minimal logic
- Main purpose is wiring layers together
