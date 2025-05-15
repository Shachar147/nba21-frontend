import React, { useState } from 'react';
import { observer } from 'mobx-react';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';
import TextInput from '../../../../components/inputs/TextInput';
import DropdownInput from '../../../../components/inputs/DropdownInput';
import SeasonGameStore from '../../stores/SeasonGameStore';
import { Player } from '../../utils/interfaces';

interface OfflineGamesModalProps {
    store: SeasonGameStore;
    visible: boolean;
    onClose: () => void;
}

const OfflineGamesModal: React.FC<OfflineGamesModalProps> = observer(({ store, visible, onClose }) => {
    const [editingGames, setEditingGames] = useState<any[]>([]);

    const handleSync = async () => {
        await store.syncOfflineGames(editingGames);
        onClose();
    };

    const columns = ['Team 1', 'Team 2', 'Score 1', 'Score 2', 'MVP'];
    const stats: Record<string, (string | number | JSX.Element)[]> = {};

    editingGames.forEach((game, index) => {
        const team1 = store.allTeamsByName[game.team1];
        const team2 = store.allTeamsByName[game.team2];
        const winner = game.score1 > game.score2 ? team1 : team2;
        const players = winner?.players || [];

        const playerOptions = players.map(player => player.name);

        const selectedPlayer = players.find(p => p.name === game.mvp_player);
        const selectedOption = selectedPlayer ? selectedPlayer.name : undefined;

        stats[`Game ${index + 1}`] = [
            game.team1,
            game.team2,
            <TextInput
                type="number"
                value={game.score1}
                onChange={(e) => {
                    const newGames = [...editingGames];
                    newGames[index] = { ...newGames[index], score1: parseInt(e.target.value) };
                    setEditingGames(newGames);
                }}
            />,
            <TextInput
                type="number"
                value={game.score2}
                onChange={(e) => {
                    const newGames = [...editingGames];
                    newGames[index] = { ...newGames[index], score2: parseInt(e.target.value) };
                    setEditingGames(newGames);
                }}
            />,
            <DropdownInput
                options={playerOptions}
                name="select_mvp"
                placeholder="Select MVP..."
                nameKey="name"
                valueKey="name"
                idKey="name"
                selectedOption={selectedOption}
                onChange={(player: Player) => {
                    const newGames = [...editingGames];
                    newGames[index] = { ...newGames[index], mvp_player: player.name };
                    setEditingGames(newGames);
                }}
            />
        ];
    });

    React.useEffect(() => {
        if (visible) {
            const offlineGames = JSON.parse(localStorage.getItem('offline_games') || '[]');
            const seasonGames = offlineGames.filter((game: any) => game.seasonId === store.seasonId);
            setEditingGames(seasonGames);
        }
    }, [visible, store.seasonId]);

    if (!visible) return null;

    return (
        <ConfirmationModal
            title="Offline Games"
            descriptionComponent={
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <table className="ui celled table">
                        <thead>
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={`col-${idx}`}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(stats).map(([key, values], idx) => (
                                <tr key={`row-${idx}`}>
                                    <td>{key}</td>
                                    {values.map((value, valueIdx) => (
                                        <td key={`cell-${idx}-${valueIdx}`}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            okText="Sync Games"
            okColor="green"
            okFunc={handleSync}
            cancelText="Cancel"
            cancelFunc={onClose}
        />
    );
});

export default OfflineGamesModal; 