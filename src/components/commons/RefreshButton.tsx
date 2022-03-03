import { Button } from 'react-bootstrap'
import { danger } from '../../models/typesTerritorios'

export const RefreshButton = () => {
    return (
        <div style = {{ display: 'block', margin: 'auto', zIndex: 3 }}>
            <Button variant={danger}
                onClick={() => window.location.reload()}
                style={{ display: 'block', margin: 'auto' }}
            >
                Refrescar
            </Button>
        </div>
    )
}
