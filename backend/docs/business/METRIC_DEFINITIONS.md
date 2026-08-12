# CRM Metric Definitions

This document serves as the single source of truth for how business metrics are calculated across vGrow AI. Both backend APIs and frontend dashboards MUST strictly adhere to these definitions to ensure financial and reporting consistency.

## 1. Revenue
**Definition**: The total expected or actual monetary value of Closed-Won Deals.
- **Records Counted**: Deals where `status = "Won"` (or equivalent terminal success stage).
- **Timezone**: Organization's timezone setting (e.g., `organization.timezone`).
- **Date Range**: Determined by `updatedAt` (when the deal status changed to Won) unless a specific `closedAt` field is introduced.
- **Aggregation**: SUM(`amount`).

## 2. Active Pipeline Value
**Definition**: The total expected monetary value of Deals currently in progress.
- **Records Counted**: Deals where `status = "In Progress"` (not Lost, not Won, not Deleted).
- **Calculation**: SUM(`amount`).
- **Weighted Pipeline**: SUM(`amount` * (`probability` / 100)).

## 3. Lead Conversion Rate
**Definition**: The percentage of leads that successfully convert to Deals/Customers over a given period.
- **Numerator**: Leads updated to `status = "Converted"` during the timeframe.
- **Denominator**: Total Leads created during the timeframe (or total leads whose status was decided in the timeframe, depending on reporting strictness).
- **Calculation**: `(Numerator / Denominator) * 100`.

## 4. Deal Win Rate
**Definition**: The percentage of deals won against total closed deals.
- **Numerator**: Deals where `status = "Won"`.
- **Denominator**: Deals where `status IN ("Won", "Lost")`.
- **Calculation**: `(Numerator / Denominator) * 100`.

## 5. Sales Cycle Length
**Definition**: The average time it takes for a deal to move from Creation to Closed-Won.
- **Records Counted**: Deals where `status = "Won"`.
- **Calculation**: AVG(`updatedAt` - `createdAt`) in days.

## 6. Activity Metrics
**Definition**: Counts of sales activities performed by users.
- **Records Counted**: Activities (`type IN ("Email", "Call", "Meeting")`).
- **Timezone**: Organization's timezone.
- **Date Range**: Filtered by `createdAt`.

> **CRITICAL RULE**: The frontend must **never** calculate Revenue or Conversion Rates by fetching all records and reducing them in JavaScript. All metric calculations must be performed on the backend database level via Prisma Aggregations (`groupBy`, `aggregate`, `sum`, `count`) and served via dedicated analytics endpoints (e.g., `/api/dashboard` or `/api/analytics`).
