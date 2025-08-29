import React from 'react';
import styles from './Table.module.css';

type Props = {
    items: { id: number; title: string; body: string }[];
};

const Table: React.FC<Props> = ({items}) => {
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Body</th>
                </tr>
                </thead>
                <tbody>
                {items.map((it) => (
                    <tr key={it.id}>
                        <td>{it.id}</td>
                        <td>{it.title}</td>
                        <td>{it.body}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
