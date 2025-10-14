
export const fetchInventory = async (): Promise<InventSum[] | null> => {
  return await apiFetch<InventSum[] | null>('/inventory');
};

export type InventSum = {
    id: number,
    unitOfMeasure: string,
    updatedAt:Date,
    quantity: number,
    formattedUpdatedAt: string,
    supplyItem: {
        id: number,
        name: string,
        code: string,
        supplier: {
            id: number,
            tradeName: string
        }
        description?: string
    },
}

// {
//     "id": 3,
//     "unitOfMeasure": "KG",
//     "updatedAt": "2025-09-30T01:03:40.017Z",
//     "quantity": 3900,
//     "supplyItem": {
//       "id": 1,
//       "name": "Acerrola",
//       "code": "123",
//       "status": "active",
//       "supplier": {
//         "id": 1,
//         "tradeName": "Fornecedor Exemplo"
//       },
//       "description": "Acerrola pra fazer suco BEEEEM doce"
//     }
//   },