import React, { Component } from "react";
import axios from "axios";
import ApiToken from './../contexts/ApiToken';

export default class Example extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			token: ""
		};
	}

	componentDidMount() {
		console.log(this.context);
	}

	handleInput = ( field, e ) => {
		this.setState( {
			[ field ]: $( e.target ).val()
		} );
	};

	handleSubmit = ( type, mess, e ) => {
		e.preventDefault();
		let data = {
			name: mess,
			token: this.state.token
		};
		$.ajax( {
			type: type,
			url: "api/v1/messengers?api_token=" + this.context,
			data: data,
			success: function( data ) {
				switch ( data ) {
					case "100":
						alert( "у вас уже подключен " + mess );
						break;

					case "101":
						alert( mess + " отключен" );
						break;

					case "102":
						alert( mess + " не подключен" );
						break;

					default:
						alert( data );
						break;
				}
			}
		} );
		/* axios.post('api/v1/messengers/add', [name => 'vk']); */
	};

	render() {
		return ( <div className="container">
			<div className="row justify-content-center">
				<div className="col-md-8">
					<div className="card">
						<div className="card-header">Example Component</div>

						<div className="card-body">
							<div className="d-flex flex-row">
								<div className="d-flex flex-column justify-content-center align-items-center col-5">
									Подключение вк
								</div>
								<form onSubmit={e => this.handleSubmit( "post", "vk", e )} className="d-flex flex-column justify-content-center align-items-center col-7">
									<div className="f-flex justify-content-center align-items-center mb-2">
										<input type="text" placeholder="token" onChange={e => this.handleInput( "token", e )}/>
									</div>
									<div className="f-flex justify-content-center align-items-center mt-2">
										<input type="submit" value="Зарегистрировать"/>
									</div>
								</form>
							</div>
						</div>
						<div className="card-body">
							<div className="d-flex flex-row">
								<form onSubmit={e => this.handleSubmit( "delete", "vk", e )} className="d-flex flex-column justify-content-center align-items-center col-12">
									<div className="f-flex justify-content-center align-items-center mt-2">
										<input type="submit" value="Удалить"/>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div> );
	}
}

Example.contextType = ApiToken;
