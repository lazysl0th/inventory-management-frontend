import { Card, Table, Badge, Alert } from "react-bootstrap";

export default function StatsTab({ inventory }) {
    //console.log(inventory)
    const { itemsCount, stats } = inventory;
    //console.log(stats)

    if (!stats) return (<Alert variant="secondary" className="m-3"> Statistics not available for this inventory. </Alert>);

    return (
        <div className="p-3 d-flex flex-column gap-4">
            <h5 className="mb-2">Inventory Statistics</h5>

            <Card>
                <Card.Body>
                    <strong>Total items:</strong>{" "}
                    <Badge bg="primary">{itemsCount}</Badge>
                </Card.Body>
            </Card>

            {/* Числовые поля */}
            {stats.numericStats?.length > 0 && (
                <Card>
                    <Card.Header>Numeric fields</Card.Header>
                    <Card.Body>
                        <Table bordered hover responsive size="sm" className="align-middle">
                        <thead>
                            <tr>
                            <th>Field</th>
                            <th>Average</th>
                            <th>Min</th>
                            <th>Max</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.numericStats.map((f) => (
                            <tr key={f.field}>
                                <td>{f.field}</td>
                                <td>{f.average?.toFixed(2) ?? "—"}</td>
                                <td>{f.min ?? "—"}</td>
                                <td>{f.max ?? "—"}</td>
                            </tr>
                            ))}
                        </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Текстовые поля */}
            {stats.textStats?.length > 0 && (
                <Card>
                    <Card.Header>Most common values</Card.Header>
                    <Card.Body>
                        {stats.textStats.map((f) => (
                        <div key={f.field} className="mb-3">
                            <strong>{f.field}</strong>
                            <Table bordered size="sm" className="mt-2">
                            <thead>
                                <tr>
                                <th>Value</th>
                                <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {f.topValues.map((v, i) => (
                                <tr key={i}>
                                    <td>{v.value || <em>—</em>}</td>
                                    <td>{v.count}</td>
                                </tr>
                                ))}
                            </tbody>
                            </Table>
                        </div>
                        ))}
                    </Card.Body>
                </Card>
            )}

            {(!stats.numericStats?.length && !stats.textStats?.length) &&
            (<Alert variant="light" className="border">No aggregated data available yet.</Alert>)}
        </div>
    );
}
