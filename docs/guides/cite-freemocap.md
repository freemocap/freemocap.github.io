---
title: Cite FreeMoCap
type: how-to
sidebar_position: 15
provenance: ai-generated
history:
  - date: "2026-08-25"
    against: "Software citation re-checked against the cloned freemocap CITATION.cff (including the prepared-but-not-yet-pushed DOI and name-order corrections), dissertation entry against the site's own accuracy-and-limits source attribution and the 2026-08-20 planning notes, and both link targets against their live pages"
  - date: "2026-08-21"
    against: "CITATION.cff (freemocap/freemocap) cross-checked against the live Zenodo API, 2026-08-21"
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
Older copies of the `CITATION.cff` file in the `freemocap/freemocap`
repository carry a placeholder DOI (`10.5281/zenodo.1234`) that was
never filled in, and two author names' given and family fields were
swapped in those same copies. A corrected version adopting the concept
DOI above has been prepared in the repository but had not landed in the
public repo as of 2026-08-25, so you may still run into the older file.
Either way, the DOI and author list above are the correct ones, so use
this page's citation if the copy of the file you're reading disagrees
with it.
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
