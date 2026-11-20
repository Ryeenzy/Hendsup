# dof (BELUM dipatch)

Pack Roblox sudah memuat pipeline DOF native (`DOFDownSample*`, `BokehNearCoC/FarCoC`, `DOFResolveNear/Far`,
`FixUpCoC`, `CheapBokeh`). Pipeline itu hanya jalan jika dunia memakai efek DepthOfField.
Mengubah CoC/bokeh lewat pack memerlukan pemetaan nama->varian (belum diketahui, nama program tidak terhubung
langsung ke tabel rekaman) dan uji di perangkat. Sampai ada dump nyata dari perangkat, parameter `dof_*` dari preset
ReShade dilaporkan sebagai "tidak diterapkan" — tidak dipura-purakan berfungsi.
