---
title: Cite FreeMoCap
type: how-to
sidebar_position: 15
provenance: ai-generated
history:
  - date: "2026-10-14"
    against: "freemocap main at v2.0.0-alpha.25 (75c8acc2): CITATION.cff (author order Matthis, Queen, Cherian, Wirth, Idehen; concept DOI 10.5281/zenodo.7233713); Zenodo API for the concept record (latest archived version v2.0.0-alpha.22, 2026-08-27, same author order); menu-builder.ts (Help > About FreeMoCap). Old notes about the v1.0.0-rc-only record and the placeholder CITATION.cff DOI removed as no longer true. Thesis citation unchanged."
  - date: "2026-08-25"
    against: "Software citation re-checked against the cloned freemocap CITATION.cff (including the prepared-but-not-yet-pushed DOI and name-order corrections), dissertation entry against the site's own accuracy-and-limits source attribution and the 2026-08-20 planning notes, and both link targets against their live pages"
  - date: "2026-08-21"
    against: "CITATION.cff (freemocap/freemocap) cross-checked against the live Zenodo API, 2026-08-21"
draft: false
---

# Cite FreeMoCap

You can cite two things: the software itself, and the validation study behind
[accuracy, validity, and limits](/concepts/accuracy-and-limits).

## Citing the software

```bibtex
@software{freemocap,
  author       = {Matthis, Jonathan Samir and
                   Queen, Philip and
                   Cherian, Aaron and
                   Wirth, Trent and
                   Idehen, Endurance},
  title        = {FreeMoCap},
  doi          = {10.5281/zenodo.7233713},
  url          = {https://github.com/freemocap/freemocap}
}
```

Or in prose: Matthis, J. S., Queen, P., Cherian, A., Wirth, T., & Idehen, E. *FreeMoCap.*
[https://doi.org/10.5281/zenodo.7233713](https://doi.org/10.5281/zenodo.7233713)

This DOI always points to the latest release archived on
[Zenodo](https://doi.org/10.5281/zenodo.7233713). To cite the exact version you used, add its
version number (shown in the app under **Help > About FreeMoCap**). Each archived version also has
its own DOI on its Zenodo page.

## Citing the validation study

```bibtex
@phdthesis{cherian2026freemocap,
  author = {Cherian, Aaron},
  title  = {Open-Source Development and Validation of a Low-Cost Markerless System for Quantitative Motion Analysis},
  school = {Northeastern University, Department of Bioengineering},
  year   = {2026}
}
```

Citation link pending publication in Northeastern's institutional repository. If your work depends
on both, cite the software alongside it.

## Next steps

- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
- [About](/about/)
