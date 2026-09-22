type PreviewImages = { down: string; front: string; side: string };

type PresetConfig = {
  headType: string | null;
  shankType: string | null;
  sideSetting: string | null;
  carvingType: string | null;
};

type RingStudioPreset = {
  code: string;
  shape: string;
  headType: string;
  shankType: string;
  sideSetting: string;
  carvingType: string;
  images: PreviewImages;
};

const PRESETS: RingStudioPreset[] = [
  {
    code: "SOL-CL",
    shape: "ROUND",
    headType: "four_prongs",
    shankType: "single",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XKV6B0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XKV6B0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XKV6B0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-CATT",
    shape: "ROUND",
    headType: "four_prongs",
    shankType: "tapered",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YU8360L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YU8360L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YU8360L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-DOP",
    shape: "ROUND",
    headType: "four_prongs",
    shankType: "double",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XTYJV0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XTYJV0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XTYJV0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-NAS",
    shape: "ROUND",
    headType: "four_prongs",
    shankType: "hidden_halo",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5ZEDVB0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5ZEDVB0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5ZEDVB0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-INT",
    shape: "ROUND",
    headType: "four_prongs",
    shankType: "double_twist",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5X31XG0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5X31XG0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5X31XG0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-SEI",
    shape: "ROUND",
    headType: "basket",
    shankType: "single",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XLIBV0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XLIBV0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XLIBV0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-VINT",
    shape: "ROUND",
    headType: "crown",
    shankType: "single",
    sideSetting: "none",
    carvingType: "leaf",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FUCU51YQ0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FUCU51YQ0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FUCU51YQ0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-VAL",
    shape: "OVAL",
    headType: "peg_head",
    shankType: "tapered",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YWGFQ0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YWGFQ0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YWGFQ0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-CAT",
    shape: "EMERALD",
    headType: "basket",
    shankType: "contemporary",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ83YKIV0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ83YKIV0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ83YKIV0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "SOL-TEN",
    shape: "PRINCESS",
    headType: "peg_head",
    shankType: "knife_edge",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YEBNB0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YEBNB0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YEBNB0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "HALO-CL",
    shape: "ROUND",
    headType: "single_halo",
    shankType: "single",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNBSL0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNBSL0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNBSL0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "HALO-CUS",
    shape: "CUSHION",
    headType: "single_halo",
    shankType: "square_edge",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YOLC60L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YOLC60L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5YOLC60L1M4Z.jpg?v=3",
    },
  },
  {
    code: "HALO-DOP",
    shape: "ROUND",
    headType: "double_halo",
    shankType: "single",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNWX60L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNWX60L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XNWX60L1M4Z.jpg?v=3",
    },
  },
  {
    code: "HALO-FIO",
    shape: "ROUND",
    headType: "flower_halo",
    shankType: "single",
    sideSetting: "none",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XRJWL0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XRJWL0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ5XRJWL0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "PAVE-GAM",
    shape: "ROUND",
    headType: "four_prongs",
    shankType: "single",
    sideSetting: "pave",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FRDPMJBB0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FRDPMJBB0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FRDPMJBB0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "PAVE-MET",
    shape: "OVAL",
    headType: "basket",
    shankType: "single",
    sideSetting: "u_pave",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82E57B0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82E57B0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82E57B0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "PAVE-TOR",
    shape: "ROUND",
    headType: "four_prongs",
    shankType: "double_twist",
    sideSetting: "u_pave",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82WOSG0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82WOSG0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ82WOSG0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "TRIL-CL",
    shape: "OVAL",
    headType: "crown",
    shankType: "split",
    sideSetting: "prong",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FRB8EDXQ0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FRB8EDXQ0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FRB8EDXQ0L1M4Z.jpg?v=3",
    },
  },
  {
    code: "TRE-CAT",
    shape: "EMERALD",
    headType: "flower_halo",
    shankType: "tapered",
    sideSetting: "bead",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FRANAU510L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FRANAU510L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FRANAU510L1M4Z.jpg?v=3",
    },
  },
  {
    code: "TRIL-BAG",
    shape: "RADIANT",
    headType: "crown",
    shankType: "double",
    sideSetting: "channel",
    carvingType: "plain",
    images: {
      down: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ7ICWYB0L1M4Z.jpg?v=1",
      front: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ7ICWYB0L1M4Z.jpg?v=2",
      side: "https://image25.thepersonalizedbest.com/image/api_image61/6FQ7ICWYB0L1M4Z.jpg?v=3",
    },
  },
];

export function getRingStudioPreset(config: PresetConfig, stoneShape: string): RingStudioPreset {
  const shape = stoneShape.toUpperCase();
  return PRESETS.reduce((best, candidate) => {
    const score =
      (candidate.shape === shape ? 3 : 0) +
      (candidate.headType === config.headType ? 8 : 0) +
      (candidate.shankType === config.shankType ? 5 : 0) +
      (candidate.sideSetting === config.sideSetting ? 4 : 0) +
      (candidate.carvingType === config.carvingType ? 2 : 0);
    const bestScore =
      (best.shape === shape ? 3 : 0) +
      (best.headType === config.headType ? 8 : 0) +
      (best.shankType === config.shankType ? 5 : 0) +
      (best.sideSetting === config.sideSetting ? 4 : 0) +
      (best.carvingType === config.carvingType ? 2 : 0);
    return score > bestScore ? candidate : best;
  }, PRESETS[0]);
}
