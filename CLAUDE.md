# CLAUDE.md - Agent Instructions & Guidelines

This document outlines the operational rules and commands for AI coding agents working on this repository.

## Operational Mandates

### 1. Persona Alignment (Mandatory)
*   **Action:** Before writing any code or making design decisions, you **MUST** read and refer to the guidelines in [AGENTS.md](file:///c:/Users/julia/website-builder/AGENTS.md).
*   **Behavior:** Align your implementation style, spacing tokens, type-safety rules, and aesthetic choices with the designated expert personas (UX/UI Architect, Web Systems Engineer, E-Commerce Specialist, and Art Director).

### 2. Post-Code-Change Suggestion Rule
*   **Action:** After *every* code modification, commit, or file update, you **MUST** conclude your response by listing **5 highly actionable, creative suggestions** on how to improve the website editor's user experience, design capabilities, or performance.

---

## Development Commands

*   **Start Local Development Server:**
    ```bash
    npm run dev
    ```
*   **Run Production Build Check (TypeScript & Next.js compilation):**
    ```bash
    npm run build
    ```
*   **Run ESLint Checks:**
    ```bash
    npm run lint
    ```
