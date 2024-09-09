# openems-girasol-pub

## Girasol Energy OpenEMS Repository Strategy

```mermaid
graph TD
    UPSTREAM("openems/openems
    (upstream)") -- merge regularly --> GIRASOL["girasolenergy/openems-girasol\n（private)"]
    GIRASOL -- "customize code for our usecases\nw/o structural change / style change\n(*1)"--> GIRASOL
    GIRASOL -- publish /ui to compliant AGPL--> GIRASOLPUB(girasolenergy/openems-girasol-pub)
    GIRASOL -- "if the chenge(*1) is useful for evenryone,\nwe plan to contribute to upstream via openems-fork"--> FORK[girasolenergy/openems-fork]
    FORK -- "contribute\n- useful change for everyone\n- structural change / style change"--> UPSTREAM
```

## OSS License Compliance

For compliance of EPL-2, we have opened oss@pplc.co. When you received derived works from us then you should received code but if you have trouble please contact through the e-mail.

For compliance of AGPL-3.0, we publish the source code in this repository.
