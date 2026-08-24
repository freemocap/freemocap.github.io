---
title: Cite FreeMoCap
type: how-to
sidebar_position: 15
provenance: ai-generated
reviewed: 2026-08-21
reviewed_against: CITATION.cff (freemocap/freemocap) cross-checked against the live Zenodo API, 2026-08-21
draft: false
---

# Cite FreeMoCap

Two separate things get cited depending on what you're referencing: the
software itself, and the validation study behind
[accuracy, validity, and limits](/concepts/accuracy-and-limits).

## Citing the software

```bibtex
@software{freemocap,
  author       = {Queen, Philip and
                   Cherian, Aaron and
                   Wirth, Trent and
                   Idehen, Endurance and
                   Matthis, Jonathan Samir},
  title        = {freemocap},
  doi          = {10.5281/zenodo.7233713},
  url          = {https://github.com/freemocap/freemocap}
}
```

Or in prose: Queen, P., Cherian, A., Wirth, T., Idehen, E., & Matthis,
J. S. *FreeMoCap.* [https://doi.org/10.5281/zenodo.7233713](https://doi.org/10.5281/zenodo.7233713)

That DOI is Zenodo's **concept DOI**, it always resolves to the latest
released version rather than pinning to one snapshot. As of this
writing the latest (and only) release Zenodo has on record is `v1.0.0-rc`
from March 2023, notably behind the actively developed `v2.0.0-alpha`
line on GitHub. If you need to cite the exact version you actually used
and it's newer than that, cite the
[GitHub repository](https://github.com/freemocap/freemocap) directly and
note the commit or tag, rather than implying a Zenodo-versioned release
that doesn't exist yet.

:::note If you're checking against CITATION.cff yourself
The `CITATION.cff` file in the `freemocap/freemocap` repository has the
right author list but a placeholder DOI (`10.5281/zenodo.1234`) that was
never filled in. The DOI above is the real one, verified directly
against Zenodo's own API.
:::

## Citing the validation study

```bibtex
@phdthesis{cherian2026freemocap,
  author = {Cherian, Aaron},
  title  = {Open-Source Development and Validation of a Low-Cost Markerless System for Quantitative Motion Analysis},
  school = {Northeastern University, Department of Bioengineering},
  year   = {2026}
}
```

Citation link pending publication in Northeastern's institutional
repository. Cite the software (above) alongside it if your work depends
on both.

## Next steps

- [Accuracy, validity, and limits](/concepts/accuracy-and-limits)
- [About](/about/)
