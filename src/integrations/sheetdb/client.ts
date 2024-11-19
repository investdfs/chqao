const SHEETDB_API = 'https://sheetdb.io/api/v1/tz1w7esv3f69i';
const SHEETDB_AUTH = btoa('2jhppl6z:3z9jqbe64lj1ex76i9mj');

export const fetchSheetData = async () => {
  try {
    const response = await fetch(SHEETDB_API, {
      headers: {
        'Authorization': `Basic ${SHEETDB_AUTH}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};

export const insertSheetData = async (data: any) => {
  try {
    console.log('Inserindo dados no SheetDB:', data);
    const response = await fetch(SHEETDB_API, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${SHEETDB_AUTH}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [data]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to insert sheet data');
    }

    const result = await response.json();
    console.log('Dados inseridos com sucesso:', result);
    return result;
  } catch (error) {
    console.error('Error inserting sheet data:', error);
    throw error;
  }
};