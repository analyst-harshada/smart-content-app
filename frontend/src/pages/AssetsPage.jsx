import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { Upload } from '@progress/kendo-react-upload';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';

function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch assets
  useEffect(() => {
    api.get('/assets/files/')
      .then(res => {
        setAssets(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading assets:', err);
        setIsLoading(false);
      });
  }, []);

  // Handle file upload
  const handleUpload = (event) => {
    if (event.affectedFiles && event.affectedFiles.length > 0) {
      const file = event.affectedFiles[0].rawFile;
      const formData = new FormData();
      formData.append('name', event.affectedFiles[0].name);
      formData.append('file', file);
      
      api.post('/assets/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(res => {
          setAssets([res.data, ...assets]);
        })
        .catch(err => console.error('Error uploading file:', err));
    }
  };

  // Handle file deletion
  const handleDelete = (assetId) => {
    api.delete(`/assets/files/${assetId}/`)
      .then(() => {
        setAssets(assets.filter(asset => asset.id !== assetId));
      })
      .catch(err => console.error('Error deleting file:', err));
  };

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset => 
    searchTerm === '' || 
    (asset.name && asset.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Action cell template
  const ActionCell = (props) => {
    return (
      <td>
        <Button onClick={() => handleDelete(props.dataItem.id)} icon="trash" look="flat">
          Delete
        </Button>
      </td>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Media Assets</h1>
      
      <div className="mb-6">
        <Upload
          batch={false}
          multiple={false}
          autoUpload={false}
          restrictions={{
            allowedExtensions: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx']
          }}
          onAdd={handleUpload}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : (
        <Grid
          data={filteredAssets}
          sortable={true}
          pageable={{ pageSizes: [10, 20, 50] }}
        >
          <GridToolbar>
            <div className="k-toolbar-spacer"></div>
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.value)}
              className="w-64"
            />
          </GridToolbar>
          <GridColumn field="id" title="ID" width="70px" />
          <GridColumn field="name" title="Name" />
          <GridColumn field="file_type" title="Type" width="120px" />
          <GridColumn 
            field="uploaded_at" 
            title="Uploaded" 
            width="150px"
            cell={(props) => (
              <td>{formatDate(props.dataItem.uploaded_at)}</td>
            )}
          />
          <GridColumn cell={ActionCell} width="100px" />
        </Grid>
      )}
    </div>
  );
}

export default AssetsPage;