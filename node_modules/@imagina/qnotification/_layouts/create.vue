<template>
	<div id="pageCreateNotification"
	     class="q-layout-page row layout-padding q-container">

		<div class="text_title text-blue-9 col-xs-12 q-title text-right">
			<span>NOTIFICATIONS</span>
		</div>

		<div class="q-py-md q-title col-xs-12 text-negative">
			• CREATE
		</div>

		<div id="formNotification" class="col-12 q-box">
			<div class="form-title">
				Form Notification
			</div>

			<div class="full-width row q-py-md relative-position">
				<!--Platforms-->
				<div class="fields col-12 text-center">
          <span class="q-ma-none text-grey-6 q-subheading">
            <q-icon name="fas fa-sitemap" color="grey-7"></q-icon>
            Platforms*
          </span>
					<q-field
						:error="$v.form.platforms.$error"
						error-label="This field is required"
					>
						<q-option-group
							inline class="q-mt-xs"
							type="toggle"
							color="secondary"
							v-model="form.platforms"
							:options="platforms"
						/>
					</q-field>
				</div>

				<!--Message-->
				<div class="fields col-12 col-md-6 q-mt-md">
					<q-field
						:error="$v.form.message.$error"
						error-label="This field is required and min length"
						:count="10"
					>
						<q-input v-model="form.message"
						         color="white"
						         class="no-shadow textarea"
						         rows="4"
						         type="textarea"
						         placeholder="Message*">
						</q-input>
					</q-field>
				</div>

				<!--Other Fields-->
				<div class="col-12 col-md-6">
					<!--Summary-->
					<div class="fields col-12 col-md-6">
						<q-input v-model="form.options.summary"
						         :before="[{icon: 'fas fa-comment-alt'}]"
						         float-label="Summary">
						</q-input>
					</div>
					<!--URL-->
					<div class="fields col-12 col-md-6">
						<q-input v-model="form.options.url"
						         :before="[{icon: 'fas fa-globe'}]"
						         float-label="URL">
						</q-input>
					</div>
				</div>

				<!--== Select User to send notification ==-->
				<q-collapsible class="full-width" v-model="filterUsersContent"
				               header-style="display: none">
					<search-users v-model="usersSelected" ref="searchUserComponent"></search-users>
				</q-collapsible>

				<!--== Buttons ==-->
				<div class="fields col-12">
					<q-toggle v-model="toAllUsers"
					          class="q-py-sm"
					          left-label
					          label="To all users"/>

					<q-btn :loading="btnLoading" color="primary"
					       @click="sendNotification()"
					       class="float-right"
					       label="Send" icon="fas fa-location-arrow">
            <span slot="loading">
              Sending...
            </span>
					</q-btn>
				</div>

				<!--Inner loading-->
				<q-inner-loading :visible="loading">
					<div class="q-box-inner-loading">
						<q-spinner-hourglass size="50px" color="primary"/>
						<h6 class="q-ma-none text-primary q-title">Loading...</h6>
					</div>
				</q-inner-loading>
			</div>
		</div>
	</div>
</template>
<script>
	/*Services*/
	import platformServices from '@imagina/qnotification/_services/platforms'
	import notificationService from '@imagina/qnotification/_services/notifications'

	/*Components*/
	import searchUsers from '@imagina/quser/_components/search-users'

	//plugins
	import {required, email, numeric, minLength} from 'vuelidate/lib/validators'
	import {alert} from '@imagina/qsite/_plugins/alert'

	export default {
		props: {},
		components: {searchUsers},
		watch: {
			toAllUsers(active) {
				this.filterUsersContent = active ? false : true
			}
		},
		mounted() {
			this.$nextTick(function () {
				this.getPlatforms()
			})
		},
		data() {
			return {
				//Data
				form: this.initForm(),
				platforms: [],
				toAllUsers: true,
				usersSelected: [],

				btnLoading: false,
				filterUsersContent: false,
				loading: true
			}
		},
		/*=== VALIDATIONS ===*/
		validations: {
			form: {
				platforms: {required},
				message: {required, minLength: minLength(10)}
			},
		},
		methods: {
			//Return init form
			initForm() {
				return {
					platforms: [1],
					options: {
						summary: '',
						url: ''
					},
					message: ''
				}
			},
			//Get platforms avaliables
			getPlatforms() {
				platformServices.index().then(response => {
					let data = response.data

					if (data.length) {
						data.forEach(item => {
							let platform = {label: item.platform, value: item.id}
							item.platform != 'application' ? platform.disable = true : false

							this.platforms.push(platform)
							this.loading = false
						})
					}
				}).catch(error => {})
			},
			//Send notification
			sendNotification() {
				this.$v.$touch();//validate all fields from form

				if (!this.$v.$error) {
					this.$v.$reset();
					this.btnLoading = true

					this.form.users = this.toAllUsers ? [] :
						(this.usersSelected.usersId ? this.usersSelected.usersId : [])

					notificationService.create(this.form).then(response => {
						this.successNotification()
					}).catch(error => {})
				} else {
					alert.error('Please review the fields again.', 'bottom');
				}
			},
			//Reset form create notification
			successNotification() {
				this.form = this.initForm()
				this.toAllUsers = true
				this.$refs.searchUserComponent.reset()
				alert.success('Notification sent', 'top')
				this.btnLoading = false
			}
		}
	}
</script>
<style lang="stylus">
	#formNotification
		border 1px solid $grey-4

		.fields
			padding 5px 15px

		.q-collapsible-sub-item
			padding 8px 0
</style>
