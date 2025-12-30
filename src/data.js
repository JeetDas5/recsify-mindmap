export const initialData = {
  metadata: {
    topic: "concise visual of vitamins in human body",
    contentType: "mindmap",
    nodeCount: 23,
  },
  nodes: [
    {
      id: "root",
      data: {
        label: "Vitamins in Human Body",
        type: "root",
        summary:
          "Essential micronutrients required for normal metabolic function, growth, and overall health, typically obtained through diet. They are vital for diverse bodily processes, including energy production, immune defense, and cellular repair, playing a crucial role in preventing various diseases and maintaining overall well-being.",
      },
    },
    {
      id: "cat_vitamin_classification",
      data: {
        label: "Vitamin Classification",
        type: "category",
        summary:
          "Vitamins are primarily classified based on their solubility in fats or water, which dictates their absorption, storage, and excretion mechanisms in the body. This fundamental distinction influences dietary intake recommendations, potential for toxicity, and how they are utilized by different physiological systems.",
      },
    },
    {
      id: "cat_fat_sol",
      data: {
        label: "Fat-Soluble Vitamins",
        type: "category",
        summary:
          "Vitamins A, D, E, and K. Stored in fatty tissues and liver; can accumulate to toxic levels. These vitamins are absorbed with dietary fats in the intestine and require bile salts for proper assimilation, leading to slower excretion rates and the potential for hypervitaminosis.",
      },
    },
    {
      id: "cat_water_sol",
      data: {
        label: "Water-Soluble Vitamins",
        type: "category",
        summary:
          "B-complex vitamins and Vitamin C. Not easily stored in the body; excess amounts typically excreted through urine. Due to their rapid excretion, regular dietary intake is essential to prevent deficiencies, as the body has limited reserves and cannot produce most of them.",
      },
    },
    {
      id: "cat_roles",
      data: {
        label: "Key Bodily Roles",
        type: "category",
        summary:
          "Vitamins perform diverse and critical functions across all major organ systems, acting as coenzymes, antioxidants, and regulators. They are indispensable for biochemical reactions that support growth, development, metabolism, and the maintenance of optimal health and cellular processes.",
      },
    },
    {
      id: "cat_sources",
      data: {
        label: "Dietary Sources",
        type: "category",
        summary:
          "Vitamins are primarily obtained through a balanced diet, including various food groups and some through environmental factors. A wide variety of fruits, vegetables, grains, meats, and dairy products, along with sunlight exposure, are crucial for adequate intake of these essential micronutrients.",
      },
    },
    {
      id: "cat_impact",
      data: {
        label: "Health Impact & Balance",
        type: "category",
        summary:
          "Maintaining adequate vitamin levels is crucial, as both deficiencies (hypovitaminosis) and excesses (hypervitaminoisis) can lead to health problems. These imbalances can manifest in a range of symptoms and conditions, significantly affecting long-term health and quality of life if not addressed.",
      },
    },
    {
      id: "sub_vit_a",
      data: {
        label: "Vitamin A",
        type: "category",
        summary:
          "Retinol. Essential for vision, immune function, cell growth, and skin health. Found in liver, carrots, sweet potatoes, spinach, and dairy products. Deficiency can lead to night blindness, impaired immunity, dry eyes/skin, and severe cases can cause permanent vision loss. Excess intake can be toxic.",
      },
    },
    {
      id: "sub_vit_d",
      data: {
        label: "Vitamin D",
        type: "category",
        summary:
          "Calciferol. Regulates calcium and phosphate absorption, critical for bone health, immune function, and mood. Primarily produced in skin via sunlight, also found in fatty fish and fortified foods. Deficiency can cause rickets in children and osteomalacia/osteoporosis in adults, impacting bone density and overall skeletal integrity.",
      },
    },
    {
      id: "sub_vit_e",
      data: {
        label: "Vitamin E",
        type: "category",
        summary:
          "Tocopherol. Potent antioxidant, protecting cells from damage; important for immune function and skin health. Found in nuts, seeds, vegetable oils, and leafy greens. Deficiency is rare but can lead to nerve damage, muscle weakness, vision problems, and impaired immune response due to increased oxidative stress.",
      },
    },
    {
      id: "sub_vit_k",
      data: {
        label: "Vitamin K",
        type: "category",
        summary:
          "Phylloquinone/Menaquinone. Crucial for blood clotting and bone metabolism. Obtained from leafy green vegetables (e.g., kale, spinach), broccoli, and gut bacteria. Deficiency can cause bleeding disorders, poor bone mineralization, and increased risk of fractures, as it's essential for synthesizing proteins involved in coagulation.",
      },
    },
    {
      id: "sub_vit_b_comp",
      data: {
        label: "B-Complex Vitamins",
        type: "category",
        summary:
          "A group of 8 vitamins vital for energy metabolism, nerve function, and red blood cell formation. Found in whole grains, meat, eggs, legumes, leafy greens, and dairy. Deficiencies can lead to fatigue, nerve damage (e.g., B12 anemia), skin issues, impaired brain function, and overall metabolic disruption, as they act as coenzymes in numerous cellular processes.",
      },
    },
    {
      id: "sub_vit_c",
      data: {
        label: "Vitamin C",
        type: "category",
        summary:
          "Ascorbic Acid. Powerful antioxidant, essential for collagen synthesis, immune system, and iron absorption. Rich sources include citrus fruits, berries, bell peppers, broccoli, and tomatoes. Deficiency results in scurvy, characterized by fatigue, bleeding gums, poor wound healing, and weakened connective tissues, highlighting its role in tissue repair and immunity.",
      },
    },
    {
      id: "sub_energy_metab",
      data: {
        label: "Energy Metabolism",
        type: "category",
        summary:
          "B vitamins (e.g., B1, B2, B3, B5, B7) act as coenzymes, converting carbohydrates, fats, and proteins into usable energy for the body. This process is fundamental for cellular function, muscle activity, and maintaining body temperature, supporting overall physiological vitality.",
      },
    },
    {
      id: "sub_immunity",
      data: {
        label: "Immune System Support",
        type: "category",
        summary:
          "Vitamins A, C, D, E, B6, B9, B12 play vital roles in immune cell function, antibody production, and maintaining barrier integrity. They help protect the body against pathogens, reduce inflammation, and accelerate recovery from illness, making them crucial for a robust immune response.",
      },
    },
    {
      id: "sub_bone_health",
      data: {
        label: "Bone Health",
        type: "category",
        summary:
          "Vitamins D and K are critical for calcium regulation, bone mineralization, and strength, preventing conditions like osteoporosis. Vitamin D facilitates calcium absorption, while Vitamin K directs calcium to the bones, ensuring proper bone matrix formation and reducing fracture risk.",
      },
    },
    {
      id: "sub_antioxidant",
      data: {
        label: "Antioxidant Protection",
        type: "category",
        summary:
          "Vitamins C and E protect cells from oxidative stress caused by free radicals, which can contribute to chronic diseases. By neutralizing these damaging molecules, they help maintain cellular integrity, reduce inflammation, and support healthy aging, safeguarding against cellular damage.",
      },
    },
    {
      id: "sub_fruit_veg",
      data: {
        label: "Fruits & Vegetables",
        type: "category",
        summary:
          "Rich sources of Vitamin C, A (beta-carotene), Folate, and various B vitamins. Examples include citrus, leafy greens, berries, bell peppers, and cruciferous vegetables. Consuming a diverse range provides a broad spectrum of essential micronutrients and antioxidants vital for health.",
      },
    },
    {
      id: "sub_meat_dairy",
      data: {
        label: "Meat & Dairy",
        type: "category",
        summary:
          "Sources of Vitamin B12, D (fortified dairy, fatty fish), A (liver, eggs, dairy), K (certain meats). Examples: red meat, fish, eggs, milk, and cheese. These food groups are particularly important for fat-soluble vitamins and specific B vitamins often less abundant in plant-based diets.",
      },
    },
    {
      id: "sub_grains_nuts",
      data: {
        label: "Grains & Nuts",
        type: "category",
        summary:
          "Provide B vitamins (whole grains), Vitamin E (nuts, seeds, vegetable oils), and some minerals. Examples: oats, brown rice, almonds, sunflower seeds, and whole-wheat bread. They offer essential energy, fiber, and micronutrients crucial for metabolic processes and cellular protection.",
      },
    },
    {
      id: "sub_fortified_foods",
      data: {
        label: "Sunlight & Fortified",
        type: "category",
        summary:
          "Sunlight is the primary source of Vitamin D, essential for its endogenous production in the skin. Many foods (e.g., cereals, milk, plant-based milks, orange juice) are artificially enriched with various vitamins (like D, B12, folate) to address common dietary gaps and public health needs.",
      },
    },
    {
      id: "sub_deficiency",
      data: {
        label: "Deficiency",
        type: "category",
        summary:
          "Lack of sufficient vitamins (hypovitaminosis), leading to specific health conditions and impaired bodily functions. Can range from mild to severe, causing symptoms like fatigue, impaired vision, weakened immunity, and long-term chronic diseases if left unaddressed. Common causes include inadequate diet, malabsorption, and increased requirements.",
      },
    },
    {
      id: "sub_excess",
      data: {
        label: "Excess",
        type: "category",
        summary:
          "Over-consumption of vitamins (hypervitaminoisis), primarily fat-soluble ones (A, D, E, K), leading to toxicity and adverse health effects. Symptoms vary by vitamin but can include nausea, organ damage, bone abnormalities, and neurological issues, emphasizing the importance of balanced intake and avoiding megadoses without medical supervision.",
      },
    },
  ],
  edges: [
    {
      id: "e_root_cat_vitamin_classification",
      source: "root",
      target: "cat_vitamin_classification",
      type: "connects",
    },
    {
      id: "e_root_cat_roles",
      source: "root",
      target: "cat_roles",
      type: "connects",
    },
    {
      id: "e_root_cat_sources",
      source: "root",
      target: "cat_sources",
      type: "connects",
    },
    {
      id: "e_root_cat_impact",
      source: "root",
      target: "cat_impact",
      type: "connects",
    },
    {
      id: "e_cat_vitamin_classification_cat_fat_sol",
      source: "cat_vitamin_classification",
      target: "cat_fat_sol",
      type: "connects",
    },
    {
      id: "e_cat_vitamin_classification_cat_water_sol",
      source: "cat_vitamin_classification",
      target: "cat_water_sol",
      type: "connects",
    },
    {
      id: "e_cat_fat_sol_sub_vit_a",
      source: "cat_fat_sol",
      target: "sub_vit_a",
      type: "connects",
    },
    {
      id: "e_cat_fat_sol_sub_vit_d",
      source: "cat_fat_sol",
      target: "sub_vit_d",
      type: "connects",
    },
    {
      id: "e_cat_fat_sol_sub_vit_e",
      source: "cat_fat_sol",
      target: "sub_vit_e",
      type: "connects",
    },
    {
      id: "e_cat_fat_sol_sub_vit_k",
      source: "cat_fat_sol",
      target: "sub_vit_k",
      type: "connects",
    },
    {
      id: "e_cat_water_sol_sub_vit_b_comp",
      source: "cat_water_sol",
      target: "sub_vit_b_comp",
      type: "connects",
    },
    {
      id: "e_cat_water_sol_sub_vit_c",
      source: "cat_water_sol",
      target: "sub_vit_c",
      type: "connects",
    },
    {
      id: "e_cat_roles_sub_energy_metab",
      source: "cat_roles",
      target: "sub_energy_metab",
      type: "connects",
    },
    {
      id: "e_cat_roles_sub_immunity",
      source: "cat_roles",
      target: "sub_immunity",
      type: "connects",
    },
    {
      id: "e_cat_roles_sub_bone_health",
      source: "cat_roles",
      target: "sub_bone_health",
      type: "connects",
    },
    {
      id: "e_cat_roles_sub_antioxidant",
      source: "cat_roles",
      target: "sub_antioxidant",
      type: "connects",
    },
    {
      id: "e_cat_sources_sub_fruit_veg",
      source: "cat_sources",
      target: "sub_fruit_veg",
      type: "connects",
    },
    {
      id: "e_cat_sources_sub_meat_dairy",
      source: "cat_sources",
      target: "sub_meat_dairy",
      type: "connects",
    },
    {
      id: "e_cat_sources_sub_grains_nuts",
      source: "cat_sources",
      target: "sub_grains_nuts",
      type: "connects",
    },
    {
      id: "e_cat_sources_sub_fortified_foods",
      source: "cat_sources",
      target: "sub_fortified_foods",
      type: "connects",
    },
    {
      id: "e_cat_impact_sub_deficiency",
      source: "cat_impact",
      target: "sub_deficiency",
      type: "connects",
    },
    {
      id: "e_cat_impact_sub_excess",
      source: "cat_impact",
      target: "sub_excess",
      type: "connects",
    },
  ],
  hierarchy: {
    root: [
      "cat_vitamin_classification",
      "cat_roles",
      "cat_sources",
      "cat_impact",
    ],
    cat_vitamin_classification: ["cat_fat_sol", "cat_water_sol"],
    cat_fat_sol: ["sub_vit_a", "sub_vit_d", "sub_vit_e", "sub_vit_k"],
    cat_water_sol: ["sub_vit_b_comp", "sub_vit_c"],
    cat_roles: [
      "sub_energy_metab",
      "sub_immunity",
      "sub_bone_health",
      "sub_antioxidant",
    ],
    cat_sources: [
      "sub_fruit_veg",
      "sub_meat_dairy",
      "sub_grains_nuts",
      "sub_fortified_foods",
    ],
    cat_impact: ["sub_deficiency", "sub_excess"],
    sub_vit_a: [],
    sub_vit_d: [],
    sub_vit_e: [],
    sub_vit_k: [],
    sub_vit_b_comp: [],
    sub_vit_c: [],
    sub_energy_metab: [],
    sub_immunity: [],
    sub_bone_health: [],
    sub_antioxidant: [],
    sub_fruit_veg: [],
    sub_meat_dairy: [],
    sub_grains_nuts: [],
    sub_fortified_foods: [],
    sub_deficiency: [],
    sub_excess: [],
  },
};
