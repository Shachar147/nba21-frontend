import Header from "@components/layout/Header";
import TimerView from "@components/TimerView";
import PlayerCard from "@components/PlayerCard";
import {TEAM1_COLOR} from "@helpers/consts";
import ButtonInput from "@components/inputs/ButtonInput";
import React from "react";

const ShootoutGame = ({
    selected_player,
    show_save_form,
    round_length,
    score,
    onFinish,
    onChange,
    onSave,
    isSaveDisabled,
    onRematch,
    onEndGame,
    onViewStats,
    saved_game_id,
    onUpdate,
}) => {

    const _2k_rating = selected_player['_2k_rating'] || 'N/A';
    return (
        <div style={{ paddingTop: "20px" }}>
            <Header />

            {(!show_save_form) ?
                <TimerView
                    time_minutes={round_length}
                    onFinish={() => {
                        onFinish();
                    }}
                /> :
                <div>
                    <div className="ui link cards centered" style={{margin: "auto", marginBottom:"20px"}}>
                        <ButtonInput
                            text={"Rematch"}
                            onClick={onRematch}
                        />
                        <ButtonInput
                            text={"End Game"}
                            style={{ marginLeft: "5px" }}
                            onClick={onEndGame}
                        />
                        <ButtonInput
                            text={"View Stats"}
                            style={{ marginLeft:"5px" }}
                            onClick={onViewStats}
                        />
                    </div>
                    <div className="ui link cards centered" style={{margin: "auto"}}>
                        <PlayerCard
                            name={selected_player.name}
                            picture={selected_player.picture}
                            details={{
                                _2k_rating: _2k_rating,
                                percents: selected_player['3pt_percents'], // 3pt percents
                                height_meters: selected_player.height_meters,
                                weight_kgs: selected_player.weight_kgs,
                                team: selected_player.team.name,
                            }}
                            position={selected_player.position}
                            debut_year={selected_player.debut_year}
                            style={{"border": "1px solid " + TEAM1_COLOR, opacity: 1}}
                            onChange={onChange}
                            singleShot={score}
                        />
                    </div>
                    <div className="ui link cards centered" style={{ margin: "auto", marginTop:"20px" }}>
                        {
                            (saved_game_id) ?
                                (
                                    <ButtonInput
                                        text={"Update"}
                                        style={{ position: "absolute"}}
                                        onClick={onUpdate}
                                    />
                                )
                                :
                                (
                                    <ButtonInput
                                        text={"Save Result"}
                                        style={{ position: "absolute" }}
                                        onClick={onSave}
                                        disabled={isSaveDisabled}
                                    />
                                )
                        }
                    </div>
                </div>
            }

        </div>
    );
};

export default ShootoutGame;