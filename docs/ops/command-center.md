# RangeClarity Internal Command Center

The internal command-center routes are disabled by default.

## Routes

- `/ops`
- `/command-center`
- `/linear-board`

Both routes return a 404 unless this environment variable is explicitly enabled:

```text
RC_INTERNAL_PAGES_ENABLED=true
```

The default documented value is:

```text
RC_INTERNAL_PAGES_ENABLED=false
```

## Safety Rules

- Do not enable internal pages in production unless the environment is trusted.
- Do not expose Linear data, internal planning data, or operational dashboards publicly.
- Keep the default production posture disabled.
- Review this gate before any main deploy.
