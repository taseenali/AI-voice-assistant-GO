# Conversation Control Layer

## Purpose

Ensure the assistant actively drives the conversation toward conversion.

---

## Core Variables

- currentState
- intent
- engagementLevel
- conversationGoal
- contextMemory

---

## Conversation Goal States

- identify_problem
- explore_context
- position_solution
- capture_lead
- close

---

## Rules

- Always know current goal
- Never stay in one phase too long
- Move forward intentionally

---

## Engagement Levels

Low:
- vague responses

Medium:
- answering questions

High:
- expressing need / asking for help

---

## Behavior

Low → educate lightly  
Medium → deepen discovery  
High → move to close  

---

## Transition Principle

Every response must:
→ acknowledge
→ advance
→ guide