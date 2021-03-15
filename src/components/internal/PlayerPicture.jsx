import React from "react";
import PropTypes from "prop-types";
import {PLAYER_NO_PICTURE} from "../../helpers/consts";
import DropdownInput from "../inputs/DropdownInput";

export default class PlayerPicture extends React.Component {

    constructor(props) {
        super(props);

        const fallback_image = this.getFallbackImage(this.props.name)

        this.state = {
            picture: this.props.picture,
            fallback: 0,
            fallbacks: [
                this.props.picture,
                fallback_image,
                PLAYER_NO_PICTURE
            ],

            specific_replace: false,
            select_replacement: false,
        };

        this.onError = this.onError.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.picture){
            this.setState({ picture: nextProps.picture })
        }
    }

    getFallbackImage(name){
        return 'https://nba-players.herokuapp.com/players/' + name.replace(".", "").split(' ').reverse().join('/');
    }

    onError(){
        let fallback = this.state.fallback;
        const fallbacks = this.state.fallbacks;

        fallback++;
        if (fallback > fallbacks.length-1) return;
        const picture = fallbacks[fallback];
        this.setState({ picture, fallback });
    }

    componentDidMount() {

    }

    render() {

        const { styles, place, name, onReplace, onSpecificReplace, replace_options, wrapper } = this.props;
        const { picture, specific_replace, select_replacement } = this.state;
        const { container, image, placeRibbon } = styles;

        const place_text = `#${place}`;
        const place_tag = (!place || !placeRibbon) ? null : (
            <a
                className={`ui ${placeRibbon} ribbon label`}
                style={{ left: "-15px", top: "3px", position: "absolute" }}>
                {place_text}
            </a>
        );

        // replace / specific replace
        let replace = (onReplace) ? (
            <a onClick={() => {
                onReplace();
                this.setState({ specific_replace: true });
                // console.log(this.state.specific_replace);

            }} style={{ position: "absolute", bottom: "5px", zIndex:"9999999", backgroundColor: "rgba(255,255,255,1)", padding: "5px 8px", borderRadius: "10px", right: "10px", textDecoration: "underline", textTransform: "uppercase", fontSize:"11px" }}>Replace</a>
        ) : "";
        let specific_replace_link =  (specific_replace && onSpecificReplace) ? (
            <a onClick={() => {
                if (select_replacement) {
                    this.setState({ specific_replace: false, select_replacement: false });
                } else {
                    this.setState({ select_replacement: true });
                }
            }} style={{ position: "absolute", bottom: "5px", zIndex:"9999999", backgroundColor: "rgba(255,255,255,1)", padding: "5px 8px", borderRadius: "10px", right: "80px", textDecoration: "underline", textTransform: "uppercase", fontSize:"11px" }}>Specific Replace</a>
        ) : "";

        const specific_replace_block = (select_replacement) ?
            <DropdownInput
                options={replace_options}
                name={"select_replacement"}
                placeholder={"Select Replacement..."}
                nameKey={"name"}
                valueKey={"name"}
                idKey={"id"}
                style={{ height: "60px",
                    position: "absolute",
                    width: "100%",
                    padding: "5px",
                    bottom: "-60px",
                    backgroundColor: "white",
                }}
                onChange={(player) => { onSpecificReplace(player); this.setState({ select_replacement: false, specific_replace: false }); }}
            /> : "";

       const playerPicture = (
           <div className="image" style={container}>
               {place_tag}
               <img src={picture} onError={this.onError} alt={name} style={image} />
               {replace}
               {specific_replace_link}
               {specific_replace_block}
           </div>
       );

       if (wrapper) {
           return (
               <div className={"card ui centered"}>
                   {playerPicture}
               </div>
           );
       }
       return playerPicture;
    }
}

PlayerPicture.propTypes = {
    /**
     * The name of the player. required.
     *
     * Using this information this component will apply picture fallback mechanism to look for a different photo if the given one is broken link.
     */
    name:PropTypes.string.isRequired,
    /**
     * The picture of the player.
     */
    picture:PropTypes.string.isRequired,
    /**
     * What is the current place of this player?
     */
    place: PropTypes.number,
    /**
     * optional styles property, hash of the following UI settings you can control:
     *
     * \> container - hash of styles for image container
     *
     * \> image - hash of styles for the image itself
     *
     * \> placeRibbon - color (red/orange/blue etc) should we show a place ribbon that indicates player's place in a more noticeable way.
     *
     *
     * Example:
     *
     * {
     * container: { backgroundColor: "#F2F2F2" },
     * image: { width: 200, margin: "auto", padding: "20px" }
     * }
     */
    styles: PropTypes.object,

    /**
     * should we wrap this card with cards wrapper?
     *
     * default is false because usually we would like to print multiple cards under the same wrapper, so we will print the wrapper outside.
     */
    wrapper: PropTypes.bool,
};

PlayerPicture.defaultProps = {
    styles: {},
    wrapper: false,
};